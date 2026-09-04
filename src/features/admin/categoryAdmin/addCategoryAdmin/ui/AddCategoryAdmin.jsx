import React, {useState, useEffect} from 'react';
import {useImageUpload} from "@shared/hooks/uploadImg/useImageUpload";
import {useAddCategory} from "@/features/admin/categoryAdmin/addCategoryAdmin/lib/useAddCategory";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import AddImg from "@shared/imges/svg/addImg.svg?react"
import "./addCategoryAdminStyles.scss"

const AddCategoryAdmin = ({handelClose}) => {
    const [name, setName] = useState("");
    const [orderNumber, setOrderNumber] = useState("")
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [saving, setSaving] = useState(false)

    const {showSuccess, showError} = useStatusModal()

    const {
        selectedImage,
        fileInputRef,
        handleImageChange,
        handleRemoveImage,
        handleImageClick,
        uploadImage,
        isUploading,
        uploadProgress,
        uploadError
    } = useImageUpload();

    const showModal = (modalData) => {
        if (modalData.error) {
            showError(modalData.message || 'Произошла ошибка');
        } else {
            showSuccess(modalData.message || 'Операция выполнена успешно');
        }
    };

    const {
        addCategory,
        loading: addLoading,
        actionStatus,
        resetActionStatus
    } = useAddCategory(showModal);

    useEffect(() => {
        if (actionStatus?.isSuccess) {
            showSuccess(actionStatus.message);
        } else if (actionStatus?.isError) {
            showError(actionStatus.message);
        }
    }, [actionStatus]);

    useEffect(() => {
        return () => {
            resetActionStatus?.();
        };
    }, []);

    const handleFileChange = async (event) => {
        const file = handleImageChange(event);

        if (file) {
            try {
                const result = await uploadImage(file);
                setUploadedImageUrl(result.data.guid);
            } catch (error) {
                console.error('Ошибка загрузки файла:', error);
                showError('Ошибка загрузки изображения');
            }
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleAddCategory = async () => {
        setSaving(true);

        const categoryData = {
            name: name.trim(),
            order_number: parseInt(orderNumber) || 1,
            attachments_guid: uploadedImageUrl
        };

        try {
            await addCategory(categoryData);
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
            showError('Произошла ошибка при добавлении категории');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className={'add-category-wrapper'}>
                <div className={'add-category-header'}>
                    <ArrowBack onClick={handelClose} className={"add-category-header-arrow-back"}/>
                    <div className={"add-category-title"}>Новая категория</div>
                </div>

                {uploadError && (
                    <div style={{ color: 'red', fontSize: '0.8vw', padding: '0 2vw' }}>
                        Ошибка: {uploadError}
                    </div>
                )}

                {isUploading && (
                    <div style={{ padding: '0 2vw' }}>
                        Загрузка изображения: {uploadProgress}%
                    </div>
                )}

                {uploadedImageUrl && !isUploading && (
                    <div style={{ color: 'green', fontSize: '0.8vw', padding: '0 2vw' }}>
                        Изображение успешно загружено!
                    </div>
                )}

                <div className={'add-category-body'}>
                    <div className={'add-img-wrapper'}>
                        <div className={'add-img-wrapper-title'}>Иконка PNG</div>
                        <div className={'add-img-wrapper-body'} onClick={handleImageClick}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className={'add-img-wrapper-input'}
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={handleFileChange}
                                onClick={(e) => e.stopPropagation()}
                                disabled={isUploading || saving || addLoading}
                            />
                            {selectedImage ? (
                                <div className="image-preview-container">
                                    <img
                                        src={selectedImage.previewUrl}
                                        className="image-preview"
                                        alt="Preview"
                                    />
                                    <button
                                        className="remove-image-btn"
                                        onClick={(e) => {
                                            handleRemoveImage(e);
                                            setUploadedImageUrl(null);
                                        }}
                                        disabled={isUploading || saving || addLoading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <AddImg/>
                            )}
                        </div>
                    </div>

                    <div className={'add-name-wrapper'}>
                        <div className={'add-name-wrapper-header'}>
                            <div className={'add-name-wrapper-title'}>Наименование</div>
                            <input
                                type="text"
                                placeholder={"Наименование..."}
                                className={'add-name-wrapper-input'}
                                value={name}
                                onChange={handleNameChange}
                                disabled={isUploading || saving || addLoading}
                            />
                        </div>
                        <ButtonDefault
                            text={saving || addLoading ? 'Сохранение...' : (isUploading ? 'Загрузка...' : 'Сохранить')}
                            classButton={'add-name-wrapper-saveButton'}
                            onClick={handleAddCategory}
                            disabled={isUploading || saving || addLoading || !name.trim()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddCategoryAdmin;