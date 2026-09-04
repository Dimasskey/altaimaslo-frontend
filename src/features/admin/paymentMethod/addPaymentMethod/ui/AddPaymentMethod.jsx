import React, {useState} from 'react';
import "./AddPaymentMethodStyles.scss"
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import { useFetchPaymentMethod } from "@/widgets/admin/paymentMethodAdmin/lib/useFetchPaymentMethod";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";


const AddPaymentMethod = ( { handelClose } ) => {
    const [formData, setFormData] = useState({
        name:  '',
        about: ''
    });
    const [saving, setSaving] = useState(false);

    const {showError} = useStatusModal();

    const {
        createPaymentMethod,
        loading: createLoading
    } = useFetchPaymentMethod();

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleCreatePaymentMethod = async () => {
        if (!formData.name.trim()) {
            showError('Название способа оплаты обязательно');
            return;
        }

        setSaving(true);

        try {
            await createPaymentMethod(formData);
            handelClose();
        } catch (error) {
            console.error('Ошибка при создании способа оплаты:', error);
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return formData.name && formData.name.trim() !== '';
    };

    return (
        <div className={'container_add_payment-method'}>
            <div className={'container_add_payment-method-header'}>
                <ArrowBack className={'container_add_payment-method-header-arrow-back'} onClick={handelClose}/>
                <div className={"addUsers-title"}>Новый способ оплаты</div>
            </div>
            <div className={'container_add_payment-method-item'}>
                <div>
                    <span>Наименование способа оплаты:</span>
                    <input
                        className={'container_add_payment-method-item_name'}
                        placeholder={"Название способа оплаты"}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={saving || createLoading}
                    />
                </div>
                <div>
                    <span>Комментарий:</span>
                    <textarea
                        rows="5"
                        placeholder="комментарий если требуется"
                        className={'container_add_payment-method-item_comment'}
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        disabled={saving || createLoading}
                    />
                </div>
            </div>
            <ButtonDefault
                img1={PlusImg}
                text={saving || createLoading ? 'Создание...' : 'Сохранить'}
                classImg1={'container_add_payment-method-button-save-img'}
                classButton={'container_add_payment-method-button-save'}
                onClick={handleCreatePaymentMethod}
                disabled={saving || createLoading || !isFormValid()}
            />
        </div>
    );
};

export default AddPaymentMethod;