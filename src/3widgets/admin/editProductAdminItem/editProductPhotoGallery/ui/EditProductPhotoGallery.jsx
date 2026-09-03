import React, {useEffect, useState, useCallback, useMemo} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/thumbs';
import './editProductPhotoGalleryAdminStyles.scss';
import ArrowPrev from "@shared/utils/swiper/arrowPrevSwiper.svg";
import ArrowNext from "@shared/utils/swiper/arrowNextSwiper.svg";

import PlusImg from "@shared/imges/svg/plusImg.svg?react";
import PenImg from "@shared/imges/svg/pen.svg?react";
import TrashImg from "@shared/imges/svg/trashSvg.svg?react";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

const EditProductPhotoGallery = ({activeProduct, onImagesChange}) => {

    const { showConfirm }=useStatusModal()

    const [thumbSwiper, setThumbSwiper] = useState(null);
    const [images, setImages] = useState([]);
    const [uploadingIndex, setUploadingIndex] = useState(null);

    // Инициализируем изображения из активного продукта
    useEffect(() => {
        if (activeProduct?.img) {
            const initialImages = activeProduct.img.map((url, index) => ({
                url,
                guid: activeProduct.originalAttachments?.[index] || null,
                isNew: false,
                isUploading: false,
                id: `img-${index}-${Date.now()}`,
                file: null
            }));
            setImages(initialImages);
            onImagesChange?.(initialImages);
        }
    }, [activeProduct, onImagesChange]);

    const createFileInput = useCallback((accept = 'image/*') => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        return input;
    }, []);

    const processSelectedFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения');
            return null;
        }

        return {
            url: URL.createObjectURL(file),
            file,
            guid: null,
            isNew: true,
            isUploading: false,
            id: `img-new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
    }, []);

    const handleAddImage = useCallback(() => {
        const input = createFileInput();

        input.onchange = (event) => {
            const file = event.target.files[0];
            const newImage = processSelectedFile(file);

            if (newImage) {
                const updatedImages = [...images, newImage];
                setImages(updatedImages);
                onImagesChange?.(updatedImages);
            }

            input.value = '';
        };

        input.click();
    }, [images, onImagesChange, createFileInput, processSelectedFile]);

    const handleEditImage = useCallback((index) => {
        const input = createFileInput();

        input.onchange = (event) => {
            const file = event.target.files[0];
            const newImage = processSelectedFile(file);

            if (newImage) {
                const updatedImages = [...images];
                const oldImage = updatedImages[index];

                if (oldImage.isNew && oldImage.url.startsWith('blob:')) {
                    URL.revokeObjectURL(oldImage.url);
                }

                newImage.guid = oldImage.guid;

                updatedImages[index] = newImage;
                setImages(updatedImages);
                onImagesChange?.(updatedImages);
                setUploadingIndex(index);
            }

            input.value = '';
        };

        input.click();
    }, [images, onImagesChange, createFileInput, processSelectedFile]);

    const handleRemoveImage = useCallback((index, event) => {
        if (event) event.stopPropagation();

        showConfirm(
            "Удаление изображения",
            "Вы уверены, что хотите удалить это изображение?",
            {
                onConfirm: () => {
                    const updatedImages = [...images];
                    const removedImage = updatedImages[index];

                    // Освобождаем URL preview если это новое изображение
                    if (removedImage.isNew && removedImage.url.startsWith('blob:')) {
                        URL.revokeObjectURL(removedImage.url);
                    }

                    updatedImages.splice(index, 1);
                    setImages(updatedImages);
                    onImagesChange?.(updatedImages);
                },
                onCancel: () => {
                },
                confirmText: "Удалить",
                cancelText: "Отмена"
            }
        );
    }, [images, onImagesChange, showConfirm]);

    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (img.isNew && img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [images]);

    const mainSlides = useMemo(() =>
            images.map((img, index) => (
                <SwiperSlide
                    key={img.id}
                    className={'product-gallery-admin-swiper__slide'}
                >
                    <img
                        src={img.url}
                        alt={`product-${index}`}
                        className={'product-gallery-admin-swiper__img'}
                        loading="lazy"
                    />
                    {img.isUploading && (
                        <div className="upload-indicator">
                            <div className="upload-progress-bar"></div>
                        </div>
                    )}
                </SwiperSlide>
            ))
        , [images]);

    const thumbSlides = useMemo(() =>
            images.map((img, index) => (
                <SwiperSlide
                    key={`thumb-${img.id}`}
                    className={'product-gallery-admin-thumbs__thumb'}
                >
                    <img
                        src={img.url}
                        alt={`thumbnail-${index}`}
                        className={'product-gallery-admin-thumbs__image'}
                        loading="lazy"
                    />

                    <div
                        className={"pen-wrapper"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditImage(index);
                        }}
                    >
                        <PenImg/>
                    </div>

                    <div
                        className={"delete-wrapper"}
                        onClick={(e) => handleRemoveImage(index, e)}
                    >
                        <TrashImg/>
                    </div>

                    {img.isUploading && (
                        <div className="upload-indicator">
                            <div className="upload-progress-bar"></div>
                        </div>
                    )}
                </SwiperSlide>
            ))
        , [images, handleEditImage, handleRemoveImage]);

    const hasManySlides = images.length >= 3;

    return (
        <div className={'product-gallery-admin'}>
            <div className={'product-gallery-admin-container'}>
                <Swiper
                    modules={[Navigation, Thumbs]}
                    thumbs={{swiper: thumbSwiper}}
                    navigation={{
                        nextEl: ".gallery-button-next-admin",
                        prevEl: ".gallery-button-prev-admin",
                    }}
                    className={'product-gallery-admin-swiper'}
                    slidesPerView={1}
                    spaceBetween={10}
                >
                    {mainSlides}
                </Swiper>
                <div className="gallery-button-prev-admin">
                    <img className="gallery-button-prev__arrow" src={ArrowPrev} alt="Previous"/>
                </div>
                <div className="gallery-button-next-admin">
                    <img className="gallery-button-next__arrow" src={ArrowNext} alt="Next"/>
                </div>
            </div>

            <div className="product-gallery-admin-thumbs-container">
                <div
                    className="add_product_img-button"
                    onClick={handleAddImage}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="add_product_img-button-wrapper">
                        <PlusImg/>
                    </div>
                </div>

                {images.length > 0 && (
                    <Swiper
                        modules={[Thumbs]}
                        watchSlidesProgress
                        onSwiper={setThumbSwiper}
                        slidesPerView={2}
                        className={`product-gallery-admin-thumbs ${hasManySlides ? "product-gallery-admin-thumbs--many-slides" : ""}`}
                        spaceBetween={images.length === 1 ? 0 : '20px'}
                        slideActiveClass={'thumb-active'}
                    >
                        {thumbSlides}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default React.memo(EditProductPhotoGallery);