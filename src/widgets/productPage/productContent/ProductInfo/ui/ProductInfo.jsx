import React from 'react';

import "./productInfo.scss";

import ProductMeasures from "@/widgets/productPage/productContent/ProductMeasures/ProductMeasures";


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