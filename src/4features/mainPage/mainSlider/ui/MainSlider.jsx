import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import SliderImg from "@shared/utils/swiper/swiperPhoto.png"
import SliderImg2 from "@shared/utils/swiper/photo_2025-08-26_18-28-31.jpg"
import ArrowPrev from "@shared/utils/swiper/arrowPrevSwiper.svg"
import ArrowNext from "@shared/utils/swiper/arrowNextSwiper.svg"

import "./mainSlider.scss"
import 'swiper/css';
import {Autoplay, Navigation} from "swiper/modules";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useSlider} from "@/4features/mainPage/mainSlider/model/useSlider";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {useImageLoading} from "@shared/hooks/useImageLoading";

const MainSlider = () => {
    const { sliders, loading: slidersLoading, error } = useSlider()
    const isMobile = useIsMobile()
    const {handleLoad, isLoaded} = useImageLoading()

    return (
        <div className={'swiper-container'}>
            <div className={`swiper-slider-main mobile ${slidersLoading ? 'loading' : 'loaded'}`}>
                <Swiper className="swiper-slider-main__container"
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{
                            delay: 3000,
                            pauseOnMouseEnter: true
                        }}
                        loop={true}
                        speed={3000}
                        breakpoints={{
                            0: {
                                speed: 1000,
                            }
                        }}
                >
                    {sliders.map((slide, index) => {
                        const guid = isMobile
                            ? slide.attachment_guid_is_mobile
                            : slide.attachment_guid_is_pc;
                        const imageUrl = guid ? getAttachmentUrl(guid) : null;
                        const slideId = slide.id || index;

                        return (
                            <SwiperSlide
                                key={slideId}
                                className={`swiper-slider-main__slide ${isLoaded(slideId) ? 'loaded' : 'loading'}`}
                                onClick={slide.url ? () => {window.location.href = slide.url} : undefined}
                            >
                                {imageUrl ? (
                                    <img
                                        className={'swiper-slider-main_img'}
                                        src={imageUrl}
                                        loading={"lazy"}
                                        onLoad={() => handleLoad(slideId)}
                                    />
                                ) : (
                                    <div>Изображение недоступно</div>
                                )}
                            </SwiperSlide>
                        )
                    })}
                </Swiper>

            </div>
            <div className="swiper-button-prev mobile"><img className="swiper-button-prev__arrow" src={ArrowPrev}/></div>
            <div className="swiper-button-next mobile"><img className="swiper-button-next__arrow" src={ArrowNext}/></div>
        </div>

    );
};

export default MainSlider;