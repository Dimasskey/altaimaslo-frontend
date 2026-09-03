import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {useParams, useSearchParams, useNavigate} from "react-router-dom";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import "./editProductItemAdminStylest.scss"
import {useGoods} from "@shared/hooks/useGoods/useGoods";
import ProductMeasuresAdmin from "@/3widgets/admin/productMeasuresAdmin/ui/ProductMeasuresAdmin";
import EditProductPhotoGallery
    from "@/3widgets/admin/editProductAdminItem/editProductPhotoGallery/ui/EditProductPhotoGallery";
import {SlateEditor} from "@/5entities/admin/information/ui/SlateEditor/SlateEditor";
import {useSlateEditor} from "@/5entities/admin/information/lib/useSlateEditor";
import {useImageUpload} from "@shared/hooks/uploadImg/useImageUpload";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import {useAddProductInCategory} from "@shared/hooks/addProuctAdminList/useAddProductInCategory";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

const EditProductItemAdmin = ({ onClose: propOnClose, guid: propGuid }) => {

    useEffect(() => {

        document.body.classList.add('body-edit-product-item');

        return () => {
            document.body.classList.remove('body-edit-product-item');
        };

    }, []);


    const { productId: urlProductId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isModalMode = !!propGuid;
    const guid = isModalMode ? propGuid : urlProductId;

    const categoriesId = searchParams.get("categories_id");
    const categoryNameFromUrl = searchParams.get("category_name");

    const { data: products, loading, updating, getGoodsByGuids, updateGoods } = useGoods();
    const [imagesData, setImagesData] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [productMeasures, setProductMeasures] = useState([]);

    const { updateProductInCategory, isLoading: isUpdatingCategory } = useAddProductInCategory();

    const { showConfirm, showError, showSuccess } = useStatusModal();

    const {
        editor,
        value,
        setValue,
        initializeEditor,
        getHtmlContent,
        editorKey
    } = useSlateEditor();

    const nameInputRef = useRef(null);
    const minQuantityInputRef = useRef(null);
    const { uploadImage } = useImageUpload();

    const activeProduct = useMemo(() => products?.[0] || null, [products]);

    const handleClose = useCallback(() => {
        if (isModalMode && propOnClose) {
            propOnClose();
        } else {
            // Формируем обратный URL с параметрами
            const params = new URLSearchParams();
            if (categoriesId) params.append("categories_id", categoriesId);
            if (categoryNameFromUrl) params.append("category_name", categoryNameFromUrl);

            navigate(`/adminPanel/productAdmin?${params.toString()}`);
        }
    }, [isModalMode, propOnClose, navigate, categoriesId, categoryNameFromUrl]);

    useEffect(() => {
        if (guid) {
            getGoodsByGuids([guid], false);
        }
    }, [getGoodsByGuids, guid]);

    useEffect(() => {
        if (activeProduct && activeProduct.about !== undefined) {
            initializeEditor(activeProduct.about || '');
        }
    }, [activeProduct, initializeEditor]);

    useEffect(() => {
        if (activeProduct) {
            setProductMeasures(activeProduct.measures || []);
        }
    }, [activeProduct]);

    const handleImagesChange = useCallback((images) => {
        setImagesData(images);
    }, []);

    const uploadAllNewImages = useCallback(async () => {
        const newImages = imagesData.filter(img => img.isNew && img.file);
        const existingGuids = imagesData
            .filter(img => img.guid && !img.isNew)
            .map(img => img.guid);

        if (newImages.length === 0) {
            return existingGuids;
        }

        setIsUploadingImages(true);
        try {
            const uploadPromises = newImages.map(async (image) => {
                try {
                    const result = await uploadImage(image.file);
                    return result?.data?.guid;
                } catch (error) {
                    console.error('Ошибка загрузки изображения:', error);
                    throw error;
                }
            });

            const uploadedGuids = await Promise.all(uploadPromises);
            setIsUploadingImages(false);
            return [...existingGuids, ...uploadedGuids.filter(guid => guid)];
        } catch (error) {
            setIsUploadingImages(false);
            throw error;
        }
    }, [imagesData, uploadImage]);

    const handleSave = useCallback(async () => {
        if (!activeProduct) {
            showError('Не указан товар для сохранения');
            return;
        }

        try {
            const attachments = await uploadAllNewImages();
            const name = nameInputRef.current?.value || activeProduct.name;
            const minQuantity = minQuantityInputRef.current?.value || activeProduct.min_quantity;
            const about = getHtmlContent();

            const formattedMeasures = productMeasures.map(measure => ({
                id: measure.id,
                value: measure.value
            }));

            await updateGoods(activeProduct.id, {
                name,
                about,
                attachments,
                measures: formattedMeasures,
                min_quantity: minQuantity || 1
            });

            handleClose();
        } catch (error) {
            console.error('Ошибка при сохранении товара:', error);
            showError(error.message || 'Ошибка при сохранении товара');
        }
    }, [activeProduct, uploadAllNewImages, updateGoods, handleClose, getHtmlContent, productMeasures, showError, showSuccess]);

    const handleRemoveFromCategory = useCallback(async () => {
        if (!categoriesId || categoriesId === 'null' || categoriesId === 'undefined' || categoriesId.trim() === '') {
            console.error('ID категории не указан или неверный:', categoriesId);
            showError('Не указана категория для удаления товара');
            return;
        }

        if (!activeProduct) {
            console.error('Товар не загружен');
            showError('Товар не загружен');
            return;
        }

        const productId = activeProduct.guid || activeProduct.good_guid || guid;

        if (!productId) {
            console.error('Не удалось определить ID товара для удаления');
            showError('Не удалось определить ID товара');
            return;
        }

        showConfirm(
            "Удаление из категории",
            "Вы уверены, что хотите убрать этот товар из категории?",
            {
                onConfirm: async () => {
                    try {
                        const result = await updateProductInCategory(categoriesId, productId, true);

                        if (result.success) {
                            showSuccess('Товар удален из категории');
                            handleClose();
                        } else {
                            console.error('Ошибка при удалении товара из категории:', result.error);
                            showError(result.error?.message || 'Ошибка при удалении товара из категории');
                        }
                    } catch (error) {
                        console.error('Ошибка при удалении товара из категории:', error);
                        showError('Произошла ошибка при удалении товара из категории');
                    }
                },
                onCancel: () => {
                },
                confirmText: "Да, убрать",
                cancelText: "Отмена"
            }
        );
    }, [activeProduct, categoriesId, guid, updateProductInCategory, handleClose, showConfirm, showError, showSuccess]);

    const isEditorReady = useMemo(() =>
            activeProduct && editor && value && Array.isArray(value),
        [activeProduct, editor, value]
    );

    const saveButtonText = useMemo(() => {
        if (updating || isUploadingImages) return "Сохранение...";
        return "Сохранить";
    }, [updating, isUploadingImages]);

    const isSaving = updating || isUploadingImages || isUpdatingCategory;

    const showRemoveFromCategoryButton = categoriesId &&
        categoriesId !== 'null' &&
        categoriesId !== 'undefined' &&
        categoriesId.trim() !== '' &&
        activeProduct;

    return (
        <div className={`edit_product_item_admin ${loading ? 'loading' : 'loaded'}`}>
            <div className="edit_product_item_admin-header">
                <div className={"edit_product_item_admin-header-wrapper"}>
                    <ArrowBack onClick={handleClose} className={"icon-back"} />
                    Редактирование товара
                </div>
                <div className={"buttons_container"}>
                    <ButtonDefault
                        text={saveButtonText}
                        classButton="edit_product_item_admin-header-button"
                        onClick={handleSave}
                        disabled={isSaving}
                    />
                    {showRemoveFromCategoryButton && (
                        <ButtonDefault
                            text={isUpdatingCategory ? "Удаление..." : "Убрать из категории"}
                            classButton="edit_product_item_admin-header-button-remove"
                            onClick={handleRemoveFromCategory}
                            disabled={isSaving}
                        />
                    )}
                </div>
            </div>

            <div className="edit_product_item_admin-body">
                <div className="edit_product_item_admin-body-left">
                    <EditProductPhotoGallery
                        activeProduct={activeProduct}
                        onImagesChange={handleImagesChange}
                    />
                </div>
                <div className="edit_product_item_admin-body-right">
                    <div className="edit-product-input">
                        <label htmlFor="ProductName">Название:</label>
                        <input
                            id="ProductName"
                            type="text"
                            defaultValue={activeProduct?.name || ''}
                            ref={nameInputRef}
                            disabled={loading}
                        />
                    </div>
                    <div className="edit-product-input">
                        <label htmlFor="Quantity">Минимальное кол-во к заказу:</label>
                        <input
                            id="Quantity"
                            type="number"
                            defaultValue={activeProduct?.min_quantity}
                            ref={minQuantityInputRef}
                            disabled={loading}
                            min="1"
                        />
                    </div>
                    <div className="information-editor">
                        <div>Описание:</div>
                        {loading ? (
                            <div>Загрузка товара...</div>
                        ) : isEditorReady ? (
                            <SlateEditor
                                editor={editor}
                                value={value}
                                onChange={setValue}
                                editorKey={editorKey}
                                placeholder="Введите описание товара..."
                            />
                        ) : (
                            <div>Подготовка редактора...</div>
                        )}
                    </div>
                </div>
            </div>

            <ProductMeasuresAdmin
                measures={productMeasures}
                onMeasuresChange={setProductMeasures}
            />
        </div>
    );
};

export default React.memo(EditProductItemAdmin);