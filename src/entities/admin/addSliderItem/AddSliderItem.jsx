import React, { useState, useEffect } from 'react';
import "./addSliderItem.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import { useImageUpload } from '@/shared/hooks/uploadImg/useImageUpload';

const AddSliderItem = ({ onSave, onDelete, type, mode = 'add', slider = null, position = 'bottom' }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { showError, showConfirm, closeStatusModal } = useStatusModal();

    const initialImageGuid = mode === 'edit' && slider
        ? (type === 'pc' ? slider.attachment_guid_is_pc : slider.attachment_guid_is_mobile)
        : null;

    const {
        selectedImage,
        uploadProgress,
        isUploading,
        uploadError,
        fileInputRef,
        handleImageChange,
        handleRemoveImage,
        handleImageClick,
        uploadImage,
    } = useImageUpload(initialImageGuid, true);

    useEffect(() => {
        if (mode === 'edit' && slider) {
            setUrl(slider.url || '');
        }
    }, [mode, slider]);

    const handleFileChange = (event) => {
        const file = handleImageChange(event);
        if (file) {
            if (!file.type.startsWith('image/')) {
                showError('Пожалуйста, выберите файл изображения', 'Ошибка файла');
                handleRemoveImage();
                return;
            }
        }
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            let attachment_guid = null;

            // Если есть новое изображение - загружаем его
            if (selectedImage && !selectedImage.isInitial) {

                const uploadResult = await uploadImage();

                if (uploadResult && uploadResult.data && uploadResult.data.guid) {
                    attachment_guid = uploadResult.data.guid;
                } else {
                    throw new Error('Не удалось получить GUID загруженного изображения');
                }
            }
            else if (mode === 'edit' && slider) {
                attachment_guid = type === 'pc' ? slider.attachment_guid_is_pc : slider.attachment_guid_is_mobile;
            }

            if (attachment_guid === '00000000-0000-0000-0000-000000000000') {
                attachment_guid = null;
            }

            const sliderData = {
                attachment_guid: attachment_guid,
                url: url || null,
                file: selectedImage?.file
            };

            await onSave(sliderData);

        } catch (error) {
            showError(error.message || 'Произошла ошибка при сохранении слайда', 'Ошибка сохранения');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        showConfirm(
            'Вы уверены, что хотите удалить этот слайд?',
            'Подтверждение удаления',
            {
                onConfirm: () => {
                    onDelete(slider.id);
                    closeStatusModal();
                },

                onCancel: () => {
                    closeStatusModal();
                },
                confirmText: 'Удалить',
                cancelText: 'Отмена'
            }
        );
    };

    const deviceType = type === 'pc' ? 'ПК' : 'мобильный';
    const isEditMode = mode === 'edit';

    return (
        <div className={`promo-slider-add ${position === 'top' ? 'promo-slider-add--top' : ''}`}>

            <div className={`promo-slider-add-arrow ${position === 'top' ? 'promo-slider-add-arrow--top' : ''}`}></div>

            <div className="promo-slider-add-header">
                <div className="promo-slider-add-title">
                    {isEditMode ? 'Редактировать' : 'Добавить'} {deviceType} слайд
                </div>

                {selectedImage && !selectedImage.isInitial && (
                    <span>Выбрано: {selectedImage.name}</span>
                )}

                {isUploading && (
                    <div className="upload-progress">
                        Загрузка: {uploadProgress}%
                    </div>
                )}

                {uploadError && (
                    <div className="upload-error" style={{ color: 'red', fontSize: '12px' }}>
                        Ошибка: {uploadError}
                    </div>
                )}
            </div>

            <div className={"promo-slider-add-but_container"}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vw', flex: 1 }}>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={isLoading || isUploading}
                    />

                    <button
                        type="button"
                        onClick={handleImageClick}
                        className={"label_add"}
                        disabled={isLoading || isUploading}
                    >
                        {isUploading ? `Загрузка... ${uploadProgress}%` : 'Выберите файл'}
                    </button>
                </div>
            </div>

            <input
                type="text"
                placeholder={"URL:"}
                className={'promo-slider-add-URL'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading || isUploading}
            />

            <div className={"information-container-add-slide"}>
                {isEditMode && slider && (
                    <div className="slider-info">
                        <small>ID слайда: {slider.id} | Порядок: {slider.order_number + 1}</small>
                    </div>
                )}

                {isEditMode && (
                    <ButtonDefault
                        text={"Удалить слайд"}
                        onClick={handleDelete}
                        classButton={"but-remove"}
                        disabled={isLoading || isUploading}
                    />
                )}

                <ButtonDefault
                    text={isLoading || isUploading ? "Сохранение..." : (isEditMode ? "Обновить" : "Сохранить")}
                    classButton={"but-save"}
                    onClick={handleSave}
                    disabled={isLoading || isUploading}
                />
            </div>
        </div>
    );
};

export default AddSliderItem;