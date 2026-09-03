import React from 'react';
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import ProductActions from "@shared/ui/productActions/ui/ProductActions";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useModalWithClass} from "@shared/hooks/modal/useModalWithClass";
import LoginModal from "@/4features/auth/ui/LoginModal/LoginModal";

import './productActionsWrapper.scss'

const ProductActionsWrapper = ({activeProduct, loading}) => {
    const {user} = useAuth()
    const {openModal, isOpen, closeModal, modalClass, resetModalClass, setModalClass} = useModalWithClass();
    const isProductActionsLoading = loading(activeProduct?.id)

    if (user) {
        return (
            <ProductActions
                containerClass={'product-page-actions'}
                oldPrice={activeProduct?.oldPrice}
                currentPrice={activeProduct?.currentPrice}
                unit={activeProduct?.unit}
                productId={activeProduct?.id}
                stockValue={activeProduct?.stockStatus}
                perOnePosition={'right'}
                addToCartButton={true}
                showDelete={false}
                showFavorite={false}
                loading={isProductActionsLoading}
                minQuantity={activeProduct?.min_quantity}
                isAlwaysStore={activeProduct?.isAlwaysStore}
            />
        )
    }

    return (
        <div className={'product-actions-wrapper'}>
            <div className={'product-actions-wrapper__message'}>
                Чтобы добавить в корзину, войдите в аккаунт
            </div>
            <ButtonDefault classButton={'product-actions-wrapper__button'} text={'Войти'} onClick={openModal} />
            <LoginModal
                onClose={closeModal}
                setModalClass={setModalClass}
                resetModalClass={resetModalClass}
                modalClass={modalClass}
                isOpen={isOpen}
            />
        </div>
    );
};

export default ProductActionsWrapper;