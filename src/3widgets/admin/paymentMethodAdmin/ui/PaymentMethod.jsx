import React from 'react';
import "./paymentMethodStyles.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import { useState, useEffect } from 'react';
import {useFetchPaymentMethod} from "@/3widgets/admin/paymentMethodAdmin/lib/useFetchPaymentMethod";
import PaymentMethodItem from "@/5entities/admin/paymentMethodItem/ui/PaymentMethodItem";
import AddPaymentMethod from "@/4features/admin/paymentMethod/addPaymentMethod/ui/AddPaymentMethod";
import EditPaymentMethod from "@/4features/admin/paymentMethod/editPaymentMethod/ui/EditPaymentMethod";

const PaymentMethod = () => {

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [openAddPaymentMethod, setOpenAddPaymentMethod] = useState(false);
    const [openEditPaymentMethod, setOpenEditPaymentMethod] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const {
        getPaymentMethods,
        loading
    } = useFetchPaymentMethod();

    // Загрузка всех методов оплаты
    const loadPaymentMethods = async () => {
        try {
            const methods = await getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
        }
    };

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    function handelOpenAddPaymentMethod() {
        setOpenAddPaymentMethod(!openAddPaymentMethod);
    }

    function handelOpenEditPaymentMethod(paymentMethod) {
        setSelectedPaymentMethod(paymentMethod);
        setOpenEditPaymentMethod(true);
    }

    const handlePaymentMethodAdded = () => {
        setOpenAddPaymentMethod(false);
        loadPaymentMethods();
    };

    const handlePaymentMethodUpdated = () => {
        setOpenEditPaymentMethod(false);
        setSelectedPaymentMethod(null);
        loadPaymentMethods();
    };

    const handlePaymentMethodDeleted = () => {
        loadPaymentMethods();
    };

    return (
        <>
            {!openAddPaymentMethod && !openEditPaymentMethod && (
                <div className={'payment-method-admin'}>

                    <div className={'payment-method-admin__header'}>
                        <div className={"payment-method-admin-title"}>Способ оплаты</div>

                        <ButtonDefault
                            text={'Добавить способ оплаты'}
                            img1={PlusImg}
                            classButton={'payment-method-admin-button'}
                            classImg1={'payment-method-admin-button_img'}
                            onClick={handelOpenAddPaymentMethod}
                        />
                    </div>

                    <div className={` payment-method-admin__body ${loading ? 'loading' : 'loaded'}`}>
                        {paymentMethods.map((method, index) => (
                            <PaymentMethodItem
                                lading={loading}
                                index={index}
                                item={method}
                                key={method.id}
                                onEdit={handelOpenEditPaymentMethod}
                                onPaymentMethodDeleted={handlePaymentMethodDeleted}
                            />
                        ))}
                    </div>

                </div>
            )}
            {openAddPaymentMethod && (
                <AddPaymentMethod
                    handelClose={handlePaymentMethodAdded}
                />
            )}
            {openEditPaymentMethod && selectedPaymentMethod && (
                <EditPaymentMethod
                    item={selectedPaymentMethod}
                    handelClose={handlePaymentMethodUpdated}
                />
            )}
        </>
    );
};

export default PaymentMethod;