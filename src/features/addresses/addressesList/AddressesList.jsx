import React from 'react';
import './addressesList.scss'
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import AddressItem from "@/features/addresses/addressesItem/AddressItem";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const AddressesList = ({addresses, onAddAddress,onEditAddress, onDeleteAddress}) => {
    const isMobile = useIsMobile()
    return (

        <div>
            <div className={'addresses-header'}>
                <span className={'addresses-header__title'}>Адреса доставки</span>
                {!isMobile ? (
                    <ButtonDefault
                        classButton={'addresses-header__button'}
                        onClick={onAddAddress}
                        text={'Добавить адрес доставки'}
                        img1={PlusImg}
                        classImg1={'addresses-header__button-icon'}
                    />
                ) : (
                    <ButtonDefault
                        classButton={'addresses-header__button'}
                        onClick={onAddAddress}
                        img1={PlusImg}
                        classImg1={'addresses-header__button-icon'}
                    />
                )}
            </div>
            <div className={'addresses-content'}>
                <div className={'addresses-list'}>
                    {addresses.map((address, index) => (
                        <AddressItem
                            key={address.guid}
                            address={address}
                            index={index}
                            onEditAddress={onEditAddress}
                            onDeleteAddress={onDeleteAddress}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddressesList;