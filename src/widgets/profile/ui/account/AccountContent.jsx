import React from 'react';

import "./accountContent.scss"
import {useAuth} from "@/app/providers/authProvider/authProvider";

const AccountContent = () => {
    const {user, loading} = useAuth()

    return (
        <div className={`account ${loading ? 'loading' : 'loaded'}`}>
            <div className={'account-title'}>
                Учетная запись
            </div>
            <div className={'account-organization'}>
                Моя организация
            </div>
            <div className={'account-description'}>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>Организация:</span>
                    <span className={'account-description-text__value'}>{user?.organization || '-'}</span>
                </div>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>ИНН:</span>
                    <span className={'account-description-text__value'}>{user?.inn || '-'}</span>
                </div>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>КПП:</span>
                    <span className={'account-description-text__value'}>{user?.kpp || '-'}</span>
                </div>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>Телефон:</span>
                    <span className={'account-description-text__value'}>{user?.phone_number || '-'}</span>
                </div>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>Электронная почта:</span>
                    <span className={'account-description-text__value'}>{user?.email || '-'}</span>
                </div>
                <div className={'account-description-text'}>
                    <span className={'account-description-text__title'}>Юридический адрес:</span>
                    <span className={'account-description-text__value'}>{user?.legal_address || '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountContent;