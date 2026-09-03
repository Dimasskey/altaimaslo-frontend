import React, {useEffect, useState} from 'react';
import './addressForm.scss'

import ArrowBack from '@shared/imges/svg/arrowBack.svg?react'
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {formatPhone} from "@shared/utils/validate";

const AddressForm = ({mode, address, onSave, onCancel}) => {
    const isEdit = mode === 'edit';

    const [formData, setFormData] = useState({
        point_name: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        point_address: ''
    })

    useEffect(() => {
        if (isEdit && address) {
            setFormData({
                point_name: address.point_name || '',
                first_name: address.first_name || '',
                last_name: address.last_name || '',
                phone_number: address.phone_number || '',
                point_address: address.point_address || '',
            });
        } else {
            setFormData({
                point_name: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                point_address: ''
            })
        }
    }, [mode, address, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone_number') {
            setFormData((prev) => ({
                ...prev,
                [name]: formatPhone(value, prev.phone_number)
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            point_name: formData.point_name,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            point_address: formData.point_address,
        }

    }

    return (
        <div className="address-form">
            <div className="form-header">
                <ArrowBack onClick={onCancel} className={'form-header__back'}/>
                <div className={'form-header__title'}>
                    {isEdit ? "Редактирование адреса" : "Новый адрес доставки"}
                </div>
            </div>
            <form className="form-content" onSubmit={onSave}>
                <div className={'form-content-person'}>
                    <div className="content-person__title">Контактное лицо</div>
                    <div className="content-person-fio">
                        <label className={'content-person-fio__name-label'} htmlFor="name">
                            Имя
                            <input
                                className={'content-person-fio__name-input'}
                                id={'name'}
                                name={'first_name'}
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label className={'content-person-fio__lastname-label'} htmlFor="lastname">
                            Фамилия
                            <input
                                className={'content-person-fio__lastname-input'}
                                id={'last_name'}
                                name={'last_name'}
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className={'content-person-number'}>
                        <label className={'content-person-fio__number-label'} htmlFor="number">
                            Контактный номер
                            <input
                                className={'content-person-fio__number-input'}
                                id={'number'}
                                name={'phone_number'}
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                </div>
                <div className={'form-content-address'}>
                    <div className={'content-address__title'}>Адрес торговой точки</div>
                    <div className={`content-address-name `}>
                        <label className={`content-address-name__label`} htmlFor="address_name">
                            Наименование
                        </label>
                        {/*{isEdit ? (*/}
                        {/*    <span className={'content-address-name--readonly'}>{formData.point_name}</span>*/}
                        {/*) : (*/}
                            <input
                                className={'content-address-name__input'}
                                id={'point_name'}
                                name={'point_name'}
                                value={formData.point_name}
                                onChange={handleChange}
                                required
                            />
                        {/*// )}*/}
                    </div>
                    <div className={`content-address-address `}>
                        <label className={`content-address-address__label`} htmlFor="address_address">
                            Адрес{isEdit ? ':' : ''}
                        </label>
                        {isEdit ? (
                            <span className={'content-address-name--readonly'}>{formData.point_address}</span>
                        ) : (
                            <textarea
                                value={formData.point_address}
                                className={'content-address-address__input'}
                                id={'address_address'}
                                name={'point_address'}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                </div>

                <ButtonDefault classButton={'form-button'} onClick={() => onSave(formData)} text={'Сохранить'} />
            </form>
        </div>
    );
};

export default AddressForm;