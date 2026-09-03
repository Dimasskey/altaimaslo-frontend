import React, {useState, useEffect} from 'react';
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import AddImg from "@shared/imges/svg/addImg.svg?react"
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import "./editCategoryStyles.scss"
import {useImageUpload} from "@shared/hooks/uploadImg/useImageUpload";
import {useUpdateCategory} from "@/4features/admin/categoryAdmin/editCategory/lib/useUpdateCategory";

const EditCategory = ({handelClose, editData}) => {
    const [name, setName] = useState(editData?.name || '');
    const [orderNumber, setOrderNumber] = useState(editData?.order_number || '');
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    const {showSuccess, showError} = useStatusModal()

    const showModal = (modalData) => {
        if (modalData.error) {
            showError(modalData.message || 'Произошла ошибка');
        } else {
            showSuccess(modalData.message || 'Операция выполнена успешно');
        }
    };

    const {
        updateCategory,
        loading: updateLoading,
        actionStatus,
        resetActionStatus
    } = useUpdateCategory(showModal);

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
    } = useImageUpload(editData?.attachments_guid);

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

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleOrderNumberChange = (e) => {
        setOrderNumber(e.target.value);
    }

    const handleFileChange = async (event) => {
        const file = handleImageChange(event);

        if (file) {
            try {
                const result = await uploadImage(file);
                setUploadedImageUrl(result.data.guid); // Сохраняем новый GUID
            } catch (error) {
                showError('Ошибка загрузки изображения');
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);

        let imageGuid = uploadedImageUrl;

        if (!uploadedImageUrl && selectedImage?.isInitial) {
            imageGuid = editData.attachments_guid;
        }

        const requestData = {
            id: editData.id,
            name: name,
            attachments_guid: imageGuid,
            order_number: parseInt(orderNumber) || 1,
        }

        try {
            await updateCategory(requestData);
        } catch (error) {
            showError('Произошла ошибка при обновлении категории');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className={'add-edit-wrapper'}>
                <div className={'add-edit-header'}>
                    <ArrowBack className={'add-edit-header-arrow-back'} onClick={handelClose}/>
                    <div className={"add-edit-title"}>Редактирование категории</div>
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

                <div className={'add-edit-body'}>
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
                                disabled={isUploading || saving || updateLoading}
                            />

                            {selectedImage ? (
                                <div className="image-preview-container">
                                    <img
                                        src={selectedImage.previewUrl}
                                        className="image-preview"
                                        alt="Preview"
                                        onError={(e) => {
                                            console.error('Ошибка загрузки изображения по URL:', selectedImage.previewUrl);
                                            e.target.src = '/default-image.png';
                                        }}
                                    />
                                    <button
                                        className="remove-image-btn"
                                        onClick={(e) => {
                                            handleRemoveImage(e);
                                            setUploadedImageUrl(null);
                                        }}
                                        disabled={isUploading || saving || updateLoading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <AddImg/>
                            )}
                        </div>

                        {selectedImage?.isInitial && (
                            <div style={{ fontSize: '0.7vw', color: '#666', marginTop: '0.5vw' }}>
                                Текущее изображение категории
                            </div>
                        )}
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
                                disabled={isUploading || saving || updateLoading}
                            />
                        </div>
                        <ButtonDefault
                            text={saving || updateLoading ? 'Сохранение...' : (isUploading ? 'Загрузка...' : 'Сохранить')}
                            classButton={'add-name-wrapper-saveButton'}
                            onClick={handleSave}
                            disabled={isUploading || saving || updateLoading || !name.trim()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditCategory;