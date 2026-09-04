import { useState, useRef, useCallback } from 'react';
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import { RequestXHR } from '@shared/api/requestXHR';

export const useImageUpload = (initialImage = null, is_compres = true) => {
    // Функция для преобразования GUID в URL
    const getImageUrlFromGuid = (guid) => {
        if (!guid) return null;
        // Преобразуем GUID в URL для отображения
        return getAttachmentUrl(guid);
    };

    const [selectedImage, setSelectedImage] = useState(() => {
        const imageUrl = getImageUrlFromGuid(initialImage);
        if (imageUrl) {
            return {
                file: null,
                previewUrl: imageUrl,
                name: 'existing-image',
                size: 0,
                type: 'image/*',
                isInitial: true,
                guid: initialImage
            };
        }
        return null;
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const fileInputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Обработка выбора файла
    const handleImageChange = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadError(null);

        // Создание preview
        const previewUrl = URL.createObjectURL(file);
        setSelectedImage({
            file,
            previewUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            isInitial: false,
            guid: null
        });

        return file;
    }, []);

    const uploadImage = useCallback(async (file = null, uploadUrl = `/api/attachments?compress=${is_compres}`) => {
        const imageFile = file || selectedImage?.file;

        if (selectedImage?.isInitial && !imageFile) {
            return {
                data: {
                    guid: selectedImage.guid
                }
            };
        }

        if (!imageFile) {
            throw new Error('Нет выбранного изображения');
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        // Создаем новый AbortController для отмены запроса
        abortControllerRef.current = new AbortController();

        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', imageFile);

            RequestXHR({
                method: 'POST',
                url: uploadUrl,
                formData: formData,
                onStart: () => {
                },
                onProgress: (percent) => {
                    setUploadProgress(percent);
                },
                onSuccess: (result) => {
                    setUploadProgress(100);
                    setIsUploading(false);
                    abortControllerRef.current = null;
                    resolve(result);
                },
                onError: (error) => {
                    setUploadError(error.message || 'Ошибка загрузки файла');
                    setIsUploading(false);
                    abortControllerRef.current = null;
                    reject(error);
                },
                controller: abortControllerRef.current,
                showModal: ({ type, title, message }) => {
                    setUploadError(message);
                }
            });
        });
    }, [selectedImage, is_compres]);

    // Отмена загрузки
    const cancelUpload = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, []);

    // Удаление изображения
    const handleRemoveImage = useCallback((e) => {
        e?.stopPropagation();

        // Отменяем текущую загрузку если она идет
        cancelUpload();

        if (selectedImage?.previewUrl && !selectedImage.isInitial) {
            URL.revokeObjectURL(selectedImage.previewUrl);
        }

        setSelectedImage(null);
        setUploadProgress(0);
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [selectedImage, cancelUpload]);

    const handleImageClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const reset = useCallback(() => {
        handleRemoveImage();
        setIsUploading(false);
        setUploadProgress(0);
        setUploadError(null);
    }, [handleRemoveImage]);

    return {
        selectedImage,
        uploadProgress,
        isUploading,
        uploadError,
        fileInputRef,
        handleImageChange,
        handleRemoveImage,
        handleImageClick,
        uploadImage,
        cancelUpload,
        reset,
        setSelectedImage
    };
};