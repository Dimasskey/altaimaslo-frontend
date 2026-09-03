import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import { PRODUCT_LIST } from '@shared/utils/testData/productList';
import 'swiper/css';
import 'swiper/css/thumbs';
import './productGallery.scss'
import ArrowPrev from "@shared/utils/swiper/arrowPrevSwiper.svg";
import ArrowNext from "@shared/utils/swiper/arrowNextSwiper.svg";
import AddToFavorites from "@/4features/addToFavorites/ui/AddToFavorites";
import StockStatus from "@shared/ui/StockStatus/StockStatus";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useImageLoading} from "@shared/hooks/useImageLoading";
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import FullscreenGallery from "@shared/ui/FullscreenGallery/FullscreenGallery";

const ProductGallery = ({activeProduct, onImagesLoaded}) => {
    const isMobile = useIsMobile()
    const [thumbSwiper, setThumbSwiper] = useState(null);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [fullscreenIndex, setFullscreenIndex] = useState(0);
    const {user} = useAuth()

    const isAuth = !!user

    const totalImages = activeProduct?.img?.length || 0;

    const {handleLoad, isAllLoaded, reset} = useImageLoading(totalImages)

    const handleMainImageClick = (index) => {
        setFullscreenIndex(index)
        setIsFullscreenOpen(true);
    }

    const handleCloseFullscreen = () => {
        setIsFullscreenOpen(false);
    }

    useEffect(() => {
        reset();
    }, [activeProduct?.img])

    useEffect(() => {
        if (isAllLoaded && onImagesLoaded) {
            onImagesLoaded()
        }
    }, [isAllLoaded, onImagesLoaded]);

    const getImageId = (type, index) => `${type}-${index}`

    return (
        <div className={'product-gallery'}>
            <div className={'product-gallery-container'}>
                <Swiper
                    modules={[Navigation, Thumbs]}
                    thumbs={{swiper: (isMobile ? undefined : thumbSwiper)}}
                    navigation={{
                        nextEl: ".gallery-button-next",
                        prevEl: ".gallery-button-prev",
                    }}
                    className={'product-gallery-swiper'}
                    slidesPerView={1}
                    spaceBetween={10}
                >
                    {activeProduct?.img?.map((img, index) => (
                        <SwiperSlide
                            key={`main-${index}`}
                            className={'product-gallery-swiper__slide'}

                        >
                            <img
                                src={img}
                                alt={img}
                                className={'product-gallery-swiper__img'}
                                onLoad={() => handleLoad(getImageId('main', index))}
                                onClick={() => handleMainImageClick(index)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="gallery-button-prev"><img className="gallery-button-prev__arrow" src={ArrowPrev}/></div>
                <div className="gallery-button-next"><img className="gallery-button-next__arrow" src={ArrowNext}/></div>
                {isAuth && <StockStatus value={activeProduct?.stockStatus} unit={activeProduct?.unit} isAlwaysStore={activeProduct?.isAlwaysStore}/>}
                {isAuth && <AddToFavorites productId={activeProduct?.id}/>}
            </div>

            {!isMobile && (
                <Swiper
                    modules={[Thumbs]}
                    watchSlidesProgress
                    onSwiper={setThumbSwiper}
                    slidesPerView={3}
                    className={`product-gallery-thumbs ${activeProduct?.img?.length >= 3 ? "product-gallery-thumbs--many-slides" : ""}`}
                    spaceBetween={activeProduct?.img?.length === 1 ? 0 : '20px'}
                    slideActiveClass={'thumb-active'}
                >
                    {activeProduct?.img?.map((img, index) => (
                        <SwiperSlide
                            key={`thumb-${index}`}
                            className={'product-gallery-thumbs__thumb'}
                        >
                            <img
                                src={img}
                                alt={img}
                                className={'product-gallery-thumbs__image'}
                                onLoad={() => handleLoad(getImageId('thumb', index))}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {isFullscreenOpen && (
                <FullscreenGallery
                    images={activeProduct?.img || []}
                    currentIndex={fullscreenIndex}
                    onClose={handleCloseFullscreen}
                />
            )}
        </div>
    );
};

export default ProductGallery;