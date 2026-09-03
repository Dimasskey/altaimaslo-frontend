import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import ArrowPrev from "@shared/utils/swiper/arrowPrevSwiper.svg"
import ArrowNext from "@shared/utils/swiper/arrowNextSwiper.svg"

import "./mainSliderAdmin.scss";

import 'swiper/css';
import 'swiper/css/pagination';

import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

const MainSliderAdmin = ({ slider, isMobile = false }) => {
    const slides = Array.isArray(slider) ? slider : [slider].filter(Boolean);

    // Определяем какой GUID использовать в зависимости от типа
    const getImageGuid = (item) => {
        return isMobile ? item.attachment_guid_is_mobile : item.attachment_guid_is_pc;
    };

    return (
        <div className={'swiper-container-admin'}>
            <div className={'swiper-slider'}>
                <Swiper
                    key={isMobile ? 'mobile' : 'pc'} // Добавляем key для принудительного пересоздания
                    className="swiper-slider__container"
                    modules={[Navigation, Pagination, Keyboard]}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    loop={slides.length > 1}
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={30}
                    keyboard={{
                        enabled: true,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                >
                    {slides.length > 0 ? (
                        slides.map((item, index) => {
                            const imageGuid = getImageGuid(item);
                            return (
                                <SwiperSlide key={item.id || index} className="swiper-slider__slide">
                                    {imageGuid && imageGuid !== '00000000-0000-0000-0000-000000000000' ? (
                                        <img
                                            src={getAttachmentUrl(imageGuid)}
                                            alt={`Слайд ${index + 1}`}
                                            className="swiper-slider_img"
                                        />
                                    ) : (
                                        <div className="slider-placeholder-main">
                                            Нет изображения для этого слайда
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                        })
                    ) : (
                        <SwiperSlide className="swiper-slider__slide">
                            <div className="slider-placeholder-main">
                                Нет слайдов для отображения
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
            {slides.length > 1 && (
                <>
                    <div className="swiper-button-prev">
                        <img className="swiper-button-prev__arrow" src={ArrowPrev} alt="Предыдущий"/>
                    </div>
                    <div className="swiper-button-next">
                        <img className="swiper-button-next__arrow" src={ArrowNext} alt="Следующий"/>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainSliderAdmin;