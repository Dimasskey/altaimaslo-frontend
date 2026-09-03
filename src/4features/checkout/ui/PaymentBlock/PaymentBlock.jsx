import React, {useEffect, useState} from 'react';

import "./paymentBlock.scss"
import {useCheckout} from "@/4features/checkout/model/CheckoutProvider";
import {useFetchPaymentMethod} from "@/3widgets/admin/paymentMethodAdmin/lib/useFetchPaymentMethod";

const PaymentBlock = () => {
    const {paymentData, updatePaymentData} = useCheckout()
    const {getPaymentMethods, loading} = useFetchPaymentMethod();

    const [paymentMethods, setPaymentMethods] = useState([])

    useEffect(() => {
        const loadMethods = async () => {
            try {
                const methods = await getPaymentMethods()
                setPaymentMethods(methods)
            } catch (error) {
                console.log(error, 'payment erorr')
            }
        }

        loadMethods()
    }, [getPaymentMethods])

    const handlePaymentUpdate = (methodId) => {
        updatePaymentData({method: methodId})
    }
    return (
        <div className={'payment-block'}>
            <span className={'payment-block__title'}>Детали</span>
            <span className={'payment-block__description'}>
                После доставки мы вышлем счёт на электронную почту и добавим на страницу заказа
в личном кабинете
            </span>
            <div className={'payment-methods'}>
                <span className={'payment-methods__title'}>Способ оплаты</span>
                <div className={`payment-methods-options ${loading ? 'loading' : 'loaded'}`}>
                    {paymentMethods.map((method) => (
                        <div key={method.id} className={'payment-method'}>
                            <div className={'payment-method-option'}>
                                <input
                                    type={'radio'}
                                    id={`method-${method.id}`}
                                    name={'method'}
                                    value={method.id}
                                    checked={paymentData.method === method.id}
                                    onChange={() => handlePaymentUpdate(method.id)}
                                />
                                <label htmlFor={`method-${method.id}`}>{method.name}</label>
                            </div>
                            {method.about !== null && (<span className={'payment-method__about'}> {method.about}</span>)}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default PaymentBlock;