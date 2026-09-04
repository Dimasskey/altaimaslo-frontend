import React, {useMemo} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ProductCardFull from "@/widgets/productCardFull/ui/ProductCardFull";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import OrderWrapperAdmin from "@shared/ui/OrderWrapperAdmin/OrderWrapperAdmin";

const ProductCardWithMiddleClick = React.memo(({
                                                   item,
                                                   onEdit,
                                                   shouldShowOrderWrapper,
                                                   categoriesId,
                                                   onUpdateSuccess,
                                                   forceRenderKey,
                                                   isLoadingState = false
                                               }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentCategoriesId = searchParams.get("categories_id");
    const currentCategoryName = searchParams.get("category_name");

    const editUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (currentCategoriesId) params.append("categories_id", currentCategoriesId);
        if (currentCategoryName) params.append("category_name", currentCategoryName);
        return `/adminPanel/editProductAdmin/${item.guid}?${params.toString()}`;
    }, [item.guid, currentCategoriesId, currentCategoryName]);

    const handleCardClick = (e) => {
        if (e.target.closest('.order-wrapper-admin') || isLoadingState) {
            return;
        }

        if (e.button === 1) {
            window.open(editUrl, '_blank');
            return;
        }

        if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            navigate(editUrl);
        }
    }

    const handleEditClick = (e) => {
        if (isLoadingState) {
            e.stopPropagation();
            return;
        }

        e.stopPropagation();
        if (e.button === 1) {
            window.open(editUrl, '_blank');
        } else {
            onEdit(item.guid);
        }
    };

    // Если карточка в состоянии загрузки, показываем скелетон
    if (isLoadingState) {
        return (
            <div className="product-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
                {shouldShowOrderWrapper && (
                    <div className="skeleton-order-wrapper">
                        <div className="skeleton-order-input"></div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={handleCardClick}
            onMouseDown={handleCardClick}
            style={{
                cursor: isLoadingState ? 'default' : 'pointer',
                position: 'relative',
                opacity: isLoadingState ? 0.7 : 1
            }}
            className={isLoadingState ? 'loading' : 'loaded'}
        >
            <ProductCardFull
                id={item.guid}
                key={`${item.guid}-${forceRenderKey}`}
                image={getAttachmentUrl(item.attachments[0])}
                title={item.name}
                oldPrice={item.old_price}
                currentPrice={item.current_price}
                unit={item.unit_quantity}
                stockStatus={item.quantity}
                cartButton={null}
                favoriteButton={null}
                editFunction={handleEditClick}
                isEdited={item.is_edited}
                orderWrapper={shouldShowOrderWrapper ? (
                    <OrderWrapperAdmin
                        productId={item.guid}
                        categoryId={categoriesId}
                        currentOrderNumber={item.order_number || 0}
                        onUpdateSuccess={onUpdateSuccess}
                        forceRenderKey={forceRenderKey}
                    />
                ) : null}
                isLoading={isLoadingState}
            />
        </div>
    );
});

export default ProductCardWithMiddleClick;