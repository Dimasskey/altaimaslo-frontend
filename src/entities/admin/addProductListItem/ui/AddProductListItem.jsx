import React, { useState, useEffect } from 'react';
import "./addProductListItemStyles.scss"
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {useAddProductInCategory} from "@shared/hooks/addProuctAdminList/useAddProductInCategory";
import PlusImg from "@shared/imges/svg/plusImg.svg?react";
import CheckmarkSvg from "@shared/imges/svg/CheckmarkSvg.svg?react"

const AddProductListItem = ( { product, isSelected, onSelect, categoriesId, goodsLoading } ) => {
    const [isAdded, setIsAdded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { updateProductInCategory, isLoading } = useAddProductInCategory();

    useEffect(() => {
        if (categoriesId && product.categories_id) {
            const categoryIdNum = parseInt(categoriesId, 10);
            const isInCategory = product.categories_id.includes(categoryIdNum);
            setIsAdded(isInCategory);
        } else if (isSelected !== undefined) {
            setIsAdded(isSelected);
        }
    }, [categoriesId, product.categories_id, isSelected]);

    async function handleAddToCategory() {
        if (isAnimating || isLoading || isAdded) return;

        if (!categoriesId) {
            console.error("ID категории не указан");
            return;
        }

        setIsAnimating(true);

        try {
            const result = await updateProductInCategory(categoriesId, product.guid, false);

            if (result.success) {
                setIsAdded(true);
                if (product.categories_id) {
                    const categoryIdNum = parseInt(categoriesId, 10);
                    if (!product.categories_id.includes(categoryIdNum)) {
                        product.categories_id.push(categoryIdNum);
                    }
                } else {
                    product.categories_id = [parseInt(categoriesId, 10)];
                }

                if (onSelect) onSelect(product.guid);

                setTimeout(() => {
                    setIsAnimating(false);
                }, 400);
            } else {
                setIsAnimating(false);
            }
        } catch (error) {
            console.error("Ошибка при добавлении товара:", error);
            setIsAnimating(false);
        }
    }

    async function handleRemoveFromCategory() {
        if (isAnimating || isLoading || !isAdded) return;

        setIsAnimating(true);

        try {
            const result = await updateProductInCategory(categoriesId, product.guid, true);

            if (result.success) {
                setIsAdded(false);
                if (product.categories_id) {
                    const categoryIdNum = parseInt(categoriesId, 10);
                    product.categories_id = product.categories_id.filter(id => id !== categoryIdNum);
                }

                if (onSelect) onSelect(product.guid);

                setTimeout(() => {
                    setIsAnimating(false);
                }, 400);
            } else {
                setIsAnimating(false);
            }
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
            setIsAnimating(false);
        }
    }

    const showCheckmark = isAdded;

    return (
        <div className={`product_list_item ${goodsLoading ? 'loading' : 'loaded'}`}>
            <div className={"product_list_item-info"}>
                <div className={"img-container"}>
                    <img
                        className={"img"}
                        src={getAttachmentUrl(product.preview_guid || product.attachments?.[0] || "00000000-0000-0000-0000-000000000000")}
                        alt={product.name || "Товар"}
                    />
                </div>
                <div className={"name"}>{product.name}</div>
            </div>

            {!showCheckmark ? (
                <div
                    className={`product_list_item-plus ${isAnimating ? 'plus-disappear' : ''}`}
                    onClick={handleAddToCategory}
                    style={{
                        display: 'flex',
                        pointerEvents: (isAnimating || isLoading) ? 'none' : 'auto',
                        opacity: (isAnimating || isLoading) ? 0.5 : 1
                    }}
                    title="Добавить в категорию"
                >
                    <PlusImg/>
                </div>
            ) : (
                <div
                    className={`product_list_item-checkmark-svg ${isAnimating ? 'checkmark-animation' : ''}`}
                    onClick={handleRemoveFromCategory}
                    style={{
                        display: 'flex',
                        pointerEvents: (isAnimating || isLoading) ? 'none' : 'auto',
                        opacity: (isAnimating || isLoading) ? 0.5 : 1
                    }}
                    title="Удалить из категории"
                >
                    <CheckmarkSvg/>
                </div>
            )}
        </div>
    );
};

export default AddProductListItem;