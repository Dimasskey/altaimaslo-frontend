import React from 'react';

import "./productList.scss"
import ProductCardFull from "@/widgets/productCardFull/ui/ProductCardFull";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {useInfinityScroll} from "@shared/hooks/useInfinityScroll/useInfinityScroll";

const ProductList = ({products, loading, loadingMore, onLoadMore}) => {
    const isMobile = useIsMobile()

    const {sentinelRef} = useInfinityScroll(onLoadMore)

    const shouldShowLoadingOnBlock = loading && !loadingMore;


    return (
        <div className={`product-list ${products.length === 0 ? "empty" : ''} ${shouldShowLoadingOnBlock ? "loading" : "loaded"}`}>
            {products.length === 0 ? (
                <div className="list-empty">
                    Товары не найдены
                </div>
            ) : (
                products.map((product) => (
                    <ProductCardFull
                        key={product.guid}
                        id={product.guid}
                        image={getAttachmentUrl(product.attachments[0], true)}
                        title={product.name}
                        oldPrice={product.old_price || null}
                        currentPrice={product.current_price}
                        unit={product.unit_quantity}
                        minQuantity={product.min_quantity}
                        stockStatus={product.quantity}
                        editingButton={null}
                        mobileInRow={isMobile}
                        loading={shouldShowLoadingOnBlock}
                        isAlwaysStore={product.is_allways_store}
                    />
                ))
            )}

            <div ref={sentinelRef} style={{height: 1}}/>
        </div>
    );
};

export default ProductList;