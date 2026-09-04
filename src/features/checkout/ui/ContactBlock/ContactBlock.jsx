import React from 'react';

import './contactBlock.scss'
import {useAuth} from "@/app/providers/authProvider/authProvider";
import {useCheckout} from "@/features/checkout/model/CheckoutProvider";

const ContactBlock = () => {
    const {deliveryData, contactLoading} = useCheckout()
    const {user } = useAuth()
    const contact = deliveryData.contactData

    return (
        <div className={'contact-block'}>
            <span className={'contact-block__title'}>Контактные данные</span>
            <div className={'contact-block-container'}>
                <div className={'contact-block-row'}>
                    <label>Имя:</label>
                    <span className={contactLoading ? 'loading' : 'loaded'}>{contact?.first_name || '-'}</span>
                </div>
                <div className={'contact-block-row'}>
                    <label>Фамилия:</label>
                    <span className={contactLoading ? 'loading' : 'loaded'}>{contact?.last_name || '-'}</span>
                </div>
                <div className={'contact-block-row'}>
                    <label>Номер телефона:</label>
                    <span className={contactLoading ? 'loading' : 'loaded'}>{contact?.phone_number || '-'}</span>
                </div>
                <div className={'contact-block-row'}>
                    <label>Email:</label>
                    <span>{user?.email || '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default ContactBlock;