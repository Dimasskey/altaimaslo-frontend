import React, { useState, useEffect, useRef } from 'react';
import "./usersDetailInfoSteles.scss";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import { useUpdateUsersAdmin } from '../lib/useUpdateUsersAdmin';
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import { useTypePrices } from '@shared/hooks/useTypePrices/useTypePrices';
import { formatPhone } from '@shared/utils/validate';

const UserDetailInfo = ({ user, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState(user || {});
    const [phoneDisplay, setPhoneDisplay] = useState('');
    const [prevPhoneValue, setPrevPhoneValue] = useState('');
    const phoneRef = useRef(null);
    const { updateUser, loading: updateLoading } = useUpdateUsersAdmin();
    const {
        typePrices,
        loading: typePricesLoading,
        getUserTypePrice,
        setUserTypePrice,
        getAllTypePrices
    } = useTypePrices();

    const typePriceOptions = typePrices.map(price => ({
        value: price.id,
        label: price.name
    }));

    useEffect(() => {
        if (user?.guid) {
            setEditedUser(user);
            if (user.phone_number) {
                setPhoneDisplay(formatPhone(user.phone_number, ''));
            }
        }
    }, [user]);

    useEffect(() => {
        getAllTypePrices();
        loadUserTypePrice();
    },[])

    const loadUserTypePrice = async () => {
        if (!user?.guid) return;

        try {
            const userPrice = await getUserTypePrice(user.guid);
            if (userPrice?.id) {
                setEditedUser(prev => ({
                    ...prev,
                    price_type: userPrice.id
                }));
            }
        } catch (error) {
            console.error('Ошибка при загрузке типа цены пользователя:', error);
        }
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const currentPrevValue = phoneDisplay;
        const formattedPhone = formatPhone(inputValue, currentPrevValue);
        setPhoneDisplay(formattedPhone);
        setPrevPhoneValue(inputValue);
        const digitsOnly = formattedPhone.replace(/\D/g, '');
        setEditedUser(prev => ({
            ...prev,
            phone_number: digitsOnly
        }));
    };

    const handleFieldChange = (field, value) => {
        // Обрабатываем пустые значения - если строка пустая, сохраняем null
        const processedValue = value === '' ? null : value;

        setEditedUser(prev => ({
            ...prev,
            [field]: processedValue
        }));
    };

    // Функция для безопасного отображения значения в input
    const getFieldValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        return value;
    };

    const handlePriceTypeChange = (selectedPriceId) => {
        setEditedUser(prev => ({
            ...prev,
            price_type: selectedPriceId
        }));
    };

    const handleSave = async () => {
        try {
            let userResult;

            if (editedUser.guid) {
                userResult = await updateUser(editedUser);
            }

            if (editedUser.guid && editedUser.price_type) {
                try {
                    await setUserTypePrice(editedUser.price_type, editedUser.guid);
                } catch (error) {
                    console.error('Ошибка при установке типа цены:', error);
                }
            }

            onSave(userResult || editedUser);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    const currentPriceType = typePriceOptions.find(option =>
        option.value === editedUser.price_type
    );

    const loading = updateLoading || typePricesLoading;

    return (
        <div className={'user-detail-wrapper'}>
            <div className={'user-detail-header'}>
                <div className={"user-detail-title"}>Учетная запись</div>
            </div>
            <div className={'user-detail-body'}>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Организация:</div>
                    <input
                        type="text"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.organization)}
                        onChange={(e) => handleFieldChange('organization', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>ИНН:</div>
                    <input
                        type="text"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.inn)}
                        onChange={(e) => handleFieldChange('inn', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>КПП:</div>
                    <input
                        type="text"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.kpp)}
                        onChange={(e) => handleFieldChange('kpp', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Телефон:</div>
                    <input
                        ref={phoneRef}
                        type="tel"
                        className={'user-detail-input'}
                        value={phoneDisplay}
                        onChange={handlePhoneChange}
                        placeholder="+7 (___) ___-__-__"
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Электронная почта:</div>
                    <input
                        type="email"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.email)}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Пароль:</div>
                    <input
                        type="text"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.password)}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Юридический адрес:</div>
                    <input
                        type="text"
                        className={'user-detail-input'}
                        value={getFieldValue(editedUser.legal_address)}
                        onChange={(e) => handleFieldChange('legal_address', e.target.value)}
                    />
                </div>

                <div className={'user-detail-field'}>
                    <div className={'user-detail-label'}>Тип цены</div>
                    {typePricesLoading ? (
                        <div className="user-detail-loading">Загрузка типов цен...</div>
                    ) : (
                        <CustomSelect
                            items={typePriceOptions}
                            type={"border"}
                            value={editedUser.price_type}
                            onValueChange={handlePriceTypeChange}
                            placeholder="Выберите тип цены"
                            withSearch={typePriceOptions.length > 5}
                        />
                    )}
                </div>

                <ButtonDefault
                    text={loading ? 'Сохранение...' : 'Сохранить'}
                    classButton={'user-detail-save-button'}
                    onClick={handleSave}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default UserDetailInfo;