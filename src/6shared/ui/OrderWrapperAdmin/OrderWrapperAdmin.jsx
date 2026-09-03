import React, { useState, useEffect, useCallback } from 'react';
import "./orderWrapperAdminStyles.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import CheckmarkSvg from "@shared/imges/svg/CheckmarkSvg.svg?react";
import { useAddProductInCategory } from "@shared/hooks/addProuctAdminList/useAddProductInCategory";

const OrderWrapperAdmin = ({
                               productId,
                               categoryId,
                               currentOrderNumber = 0,
                               onUpdateSuccess,
                               isUpdating = false,
                               forceRenderKey
                           }) => {
    const [orderNumber, setOrderNumber] = useState(currentOrderNumber?.toString() || '');
    const [isEditing, setIsEditing] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const { updateProductInCategory, isLoading } = useAddProductInCategory();

    useEffect(() => {
        setOrderNumber(currentOrderNumber?.toString() || '');
        setIsEditing(false);
        setLocalLoading(false);
    }, [forceRenderKey, currentOrderNumber]);

    useEffect(() => {
        if (isUpdating) {
            setLocalLoading(true);
        } else {
            setLocalLoading(false);
        }
    }, [isUpdating]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const handleSaveOrder = useCallback(async (e) => {
        e.stopPropagation();

        if (!productId || !categoryId) {
            return;
        }

        const orderNum = parseInt(orderNumber);
        if (isNaN(orderNum) || orderNum < 0) {
            return;
        }

        if (orderNum === currentOrderNumber) {
            setIsEditing(false);
            return;
        }

        try {
            setLocalLoading(true);

            const result = await updateProductInCategory(
                categoryId,
                productId,
                false,
                orderNum
            );

            if (result.success) {
                setIsEditing(false);

                if (onUpdateSuccess) {

                    onUpdateSuccess(orderNum, result.data || null);
                }
            }
        } catch (error) {
            setOrderNumber(currentOrderNumber?.toString() || '');
        } finally {
            setLocalLoading(false);
        }
    }, [productId, categoryId, orderNumber, currentOrderNumber, onUpdateSuccess, updateProductInCategory]);

    const handleInputChange = useCallback((e) => {
        e.stopPropagation();
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setOrderNumber(value);
            setIsEditing(true);
        }
    }, []);

    const handleKeyPress = useCallback((e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleSaveOrder(e);
        } else if (e.key === 'Escape') {
            setOrderNumber(currentOrderNumber?.toString() || '');
            setIsEditing(false);
        }
    }, [handleSaveOrder, currentOrderNumber]);

    // Обработчик для кнопки с дополнительной остановкой всплытия
    const handleButtonClick = useCallback((e) => {
        e.stopPropagation();
        handleSaveOrder(e);
    }, [handleSaveOrder]);

    const isDisabled = isLoading || localLoading;

    return (
        <div className={`order-wrapper-admin ${localLoading ? 'loading' : ''}`} onClick={(e) => e.stopPropagation()}>
            порядковый номер:
            <input
                type="number"
                className={`input ${localLoading ? 'loading' : ''}`}
                placeholder="0"
                value={orderNumber}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onClick={handleClick}
                min="0"
                disabled={isDisabled}
            />

            <ButtonDefault
                img1={CheckmarkSvg}
                classImg1={`img ${localLoading ? 'loading' : ''}`}
                onClick={handleButtonClick}
                disabled={isDisabled}
            />

            {localLoading && (
                <div className="order-update-loader">
                    <div className="loader-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default OrderWrapperAdmin;