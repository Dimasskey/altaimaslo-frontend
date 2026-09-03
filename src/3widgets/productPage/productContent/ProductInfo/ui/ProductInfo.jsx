import React, {useState} from 'react';

import "./productInfo.scss";

import {PRODUCT_LIST} from "@shared/utils/testData/productList";
import ProductMeasures from "@/3widgets/productPage/productContent/ProductMeasures/ProductMeasures";


const ProductInfo = ({activeProduct, isMobile}) => {

    return (
        <div className={'product-info'}>
            <div className={'product-info__name'}>
                {activeProduct?.name}
            </div>
            {activeProduct?.about !== "" && <div className={'product-info__description'} dangerouslySetInnerHTML={{__html: activeProduct?.about}} />}
            {activeProduct?.measures.length > 0 && (
                <ProductMeasures isMobile={isMobile} measures={activeProduct?.measures}/>
            )}
        </div>
    );
};

export default ProductInfo;