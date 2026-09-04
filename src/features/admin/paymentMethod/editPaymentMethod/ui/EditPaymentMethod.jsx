import React, {useState} from 'react';
import "./EditPaymentMethodStyles.scss"
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import {useFetchPaymentMethod} from "@/widgets/admin/paymentMethodAdmin/lib/useFetchPaymentMethod";

const EditPaymentMethod = ({ item, handelClose }) => {
    const [formData, setFormData] = useState({
        id: item.id,
        name: item?.name || '',
        about: item?.about || ''
    });
    const [saving, setSaving] = useState(false);

    const {showError} = useStatusModal();
    const {updatePaymentMethod, loading: updateLoading} = useFetchPaymentMethod();

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleUpdatePaymentMethod = async () => {
        if (!formData.name.trim()) {
            showError('Название способа оплаты обязательно');
            return;
        }

        if (!item?.id) {
            showError('ID способа оплаты не найден');
            return;
        }

        setSaving(true);

        try {
            await updatePaymentMethod(item.id, formData);
            handelClose();
        } catch (error) {
            console.error('Ошибка при обновлении способа оплаты:', error);
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return formData.name && formData.name.trim() !== '';
    };

    const hasChanges = () => {
        return formData.name !== item?.name || formData.about !== item?.about;
    };

    return (
        <div className={'container-edit-payment-method'}>
            <div className={'container-edit-payment-method-header'}>
                <ArrowBack className={'container-edit-payment-method-header-arrow-back'} onClick={handelClose}/>
                <div className={"addUsers-title"}>Редактирование способа оплаты</div>
            </div>
            <div className={'container-edit-payment-method-item'}>
                <div>
                    <span>Наименование способа оплаты:</span>
                    <input
                        className={'container-edit-payment-method-item_name'}
                        placeholder={"Название способа оплаты"}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={saving || updateLoading}
                    />
                </div>
                <div>
                    <span>Комментарий:</span>
                    <textarea
                        rows="5"
                        placeholder="комментарий если требуется"
                        className={'container-edit-payment-method-item_comment'}
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        disabled={saving || updateLoading}
                    />
                </div>
            </div>

            <ButtonDefault
                img1={PlusImg}
                classImg1={'container-edit-payment-method-button-save-img'}
                text={saving || updateLoading ? 'Сохранение...' : 'Сохранить изменения'}
                classButton={'container-edit-payment-method-button-save'}
                onClick={handleUpdatePaymentMethod}
                disabled={saving || updateLoading || !isFormValid() || !hasChanges()}
            />
        </div>
    );
};

export default EditPaymentMethod;