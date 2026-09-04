import React from 'react';

import './orderProgress.scss'
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useNavigate} from "react-router-dom";

const OrderProgress = ({currentAmount}) => {
    const MIN_ORDER_AMOUNT = 2000;
    const progress = Math.min((currentAmount / MIN_ORDER_AMOUNT) * 100, 100);
    const remaining = Math.max(MIN_ORDER_AMOUNT - currentAmount, 0)
    const isMinReached = currentAmount >= MIN_ORDER_AMOUNT;

    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    }

    return (
        <>
            {isMinReached ? (
                <ButtonDefault
                    classButton={'order-button'}
                    text={'Перейти к оформлению'}
                    onClick={handleCheckout}
                />
            ) : (
                <div className="order-progress">
                    <div
                        className="order-progress-bar"
                        style={{width:`${progress}%`}}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >

                    </div>
                    <span className="order-progress-text">
                            До заказа {remaining.toFixed(1)} ₽
                    </span>
                </div>
            )}
        </>
    );
};

export default OrderProgress;