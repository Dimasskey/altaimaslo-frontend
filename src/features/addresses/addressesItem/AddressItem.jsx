import React from 'react';

import './addressItem.scss'
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const AddressItem = ({address, index, onEditAddress, onDeleteAddress}) => {
    const isMobile = useIsMobile();
    return (
        <div className={'address-item'}>
            {isMobile && (
                <div className={`item-actions-moderated`}>
                        <span className={`item-actions-moderated__value ${address.is_moderated ? "moderated" : "not-moderated"}`}>
                            {address.is_moderated ? 'Адрес подтвержден' : 'Адрес не подтвержден'}
                        </span>
                </div>
            )}
            <div className={'address-item-info'}>
                <span className={'address-item-info__number'}>
                    {index + 1}.
                </span>
                <div className={'item-info'}>
                    <span className={'item-info__name'}>
                        {address.point_name}
                    </span>
                    <span className={'item-info__address'}>
                        {address.point_address}
                    </span>
                </div>
            </div>
            <div className={'address-item-actions'}>
                {!isMobile && (
                    <div className={`item-actions-moderated`}>
                        <span className={`item-actions-moderated__value ${address.is_moderated ? "moderated" : "not-moderated"}`}>
                            {address.is_moderated ? 'Адрес подтвержден' : 'Адрес не подтвержден'}
                        </span>
                    </div>
                )}
                <div className={'item-actions-buttons'}>
                    <button className={'actions-button__edit'} onClick={() => onEditAddress(address)}>Редактировать</button>
                    <button className={'actions-button__delete'} onClick={() => onDeleteAddress(address.guid)}>Удалить</button>
                </div>
            </div>
        </div>
    );
};

export default AddressItem;