import React, {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination} from "swiper/modules";

import "./recommendationSlider.scss"
import "swiper/css"
import 'swiper/css/pagination';

import ProductCardFull from "@/widgets/productCardFull/ui/ProductCardFull";
import {useGoods} from "@shared/hooks/useGoods/useGoods";
import {useAuth} from "@/app/providers/authProvider/authProvider";



const RecommendationSlider = () => {
    const swiperRef = useRef(null);
    const {data: recommendations, loading, getRecommendation } = useGoods(true)
    const {user} = useAuth()

    const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;

    useEffect(() => {
        getRecommendation()
    }, [user])



    return (
        <div className="recommendation-slider">
            <div className="recommendation-slider__title">Рекомендовано вам</div>
            {!hasRecommendations ? (
                <div className={`recommendation-slider-empty ${loading ? 'loading' : 'loaded'}`}>
                    Рекомендаций пока что нет...<br/>
                    Но они скоро появятся!
                </div>
            ) : (
                <Swiper className="recommendation-slider__container"
                        key={recommendations?.length}
                        ref={swiperRef}
                        modules={[Pagination, Autoplay]}
                        pagination={{
                            clickable: true
                        }}
                        slidesPerView={4}
                        spaceBetween={"10"}
                        speed={4000}
                        loop={true}
                        // autoplay={{
                        //     delay: 1,
                        //     pauseOnMouseEnter: true,
                        //     disableOnInteraction: false,
                        // }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                speed: 1000,
                                autoplay: {
                                    delay: 3000
                                }
                            },
                            768: {
                                slidesPerView: 4,
                            }
                        }}


                >
                    {recommendations?.map((product) => (
                        <SwiperSlide className="recommendation-slider__slide" key={product.id}>
                            <ProductCardFull
                                id={product.id}
                                image={product.img[0]}
                                title={product.name}
                                oldPrice={product.oldPrice || null}
                                currentPrice={product.currentPrice}
                                minQuantity={product.min_quantity}
                                unit={product.unit}
                                stockStatus={product.stockStatus}
                                isAlwaysStore={product.isAlwaysStore}
                                loading={loading}
                                editingButton={null}
                            />
                        </SwiperSlide>
                    ))
                    }
                </Swiper>
            )}

        </div>

    );
};

export default RecommendationSlider;