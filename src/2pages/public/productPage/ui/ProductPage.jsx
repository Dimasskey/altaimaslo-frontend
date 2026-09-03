import  React, {useEffect, useState} from 'react';
import TopLink from "@/3widgets/topLink/TopLink";
import Header from "@/3widgets/header/ui/Header";
import RecommendationSlider from "@/4features/mainPage/recommendationSlider/ui/RecommendationSlider";
import ProductInfo from "@/3widgets/productPage/productContent/ProductInfo/ui/ProductInfo";
import ProductGallery from "@/3widgets/productPage/productContent/ProductGallery/ui/ProductGallery";
import CowWithCart from '@shared/imges/img/cowWithCart.svg?react'
import armCow from "@shared/imges/img/рука.png"
import {useParams} from "react-router-dom";
import ProductActionsWrapper from "@/3widgets/productPage/productContent/ProductActionsWrapper/ProductActionsWrapper";

import './productPage.scss'
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useGoods} from "@shared/hooks/useGoods/useGoods";
import {useStore} from "@shared/providers/StoreProvider";
import {useAuth} from "@/1app/providers/authProvider/authProvider";

const ProductPage = () => {
    const isMobile = useIsMobile()
    const {id} = useParams();
    const {user} = useAuth()
    const {data: products, getGoodsByGuids} = useGoods()
    const {isItemLoading} = useStore()
    const [imagesLoaded, setImagesLoaded] = useState(false)

    const handleImagesLoaded = () => {
        setImagesLoaded(true)
    }

    const activeProduct = products?.[0] || null;

    const hasPrices = activeProduct && (
        activeProduct?.oldPrice !== null ||
        activeProduct?.currentPrice !== null
    )

    useEffect(() => {
        if (id) {
            getGoodsByGuids([id], false)
        }
    }, [id, getGoodsByGuids, user])

    useEffect(() => {
        if (isMobile) {
            document.body.style.paddingBottom = "40vw";
        } else {
            document.body.style.paddingBottom = '';
        }
        return () => {
            document.body.style.paddingBottom = '';
        };
    }, [isMobile]);
    return (
        <>
            <div className={'product-container'}>
                <div className={`product-content ${imagesLoaded ? 'loaded' : 'loading'}`}>
                    <div className={'product-content-top'}>
                        <ProductGallery activeProduct={activeProduct} onImagesLoaded={handleImagesLoaded} />
                        <ProductInfo activeProduct={activeProduct} isMobile={isMobile}/>
                    </div>
                </div>
                <div className={`product-cart-and-cow ${imagesLoaded ? 'loaded' : 'loading'} ${!hasPrices ? 'without-cart' : ''}`}>
                    {hasPrices && <ProductActionsWrapper activeProduct={activeProduct} loading={isItemLoading}/>}
                    {!isMobile && (
                        <div className={'product-card-cow'}>
                            <CowWithCart className={'product-card-cow__image'} />
                            <img className={'product-card-cow__arm'} src={armCow}/>
                        </div>
                    )}
                </div>
            </div>
            <RecommendationSlider />
        </>
    );
};

export default ProductPage;