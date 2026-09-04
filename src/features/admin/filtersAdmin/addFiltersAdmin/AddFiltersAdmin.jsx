import React, { useState } from 'react';
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import "./addFiltersAdminStyles.scss"
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import { useStatusModal } from '@/app/providers/statusModalProvider/statusModalProvider';

const AddFiltersAdmin = ({ onClose, onAddFilter, loading }) => { // Добавляем пропсы
    const { showSuccess, showError } = useStatusModal();
    const [formData, setFormData] = useState({
        name: '',
        unit_measure: '',
        type_unit_measure: null
    });

    const itemsSelect = [
        { label: "число", value: "number" },
        { label: "строка", value: "string" },
    ];

    const handleInputChange = (e, is_unit_measure = false) => {
        const { id, value } = e.target;
        const processedValue = is_unit_measure ? value.toLowerCase() : value;
        const fieldName = id.replace('filters-', '');

        setFormData(prev => ({
            ...prev,
            [fieldName]: processedValue
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            type_unit_measure: selectedOption || null
        }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showError('Пожалуйста, введите наименование', 'Ошибка валидации');
            return;
        }
        if (!formData.unit_measure) {
            showError('Пожалуйста, введите единицы измерения', 'Ошибка валидации');
            return;
        }
        if (!formData.type_unit_measure) {
            showError('Пожалуйста, выберите тип данных', 'Ошибка валидации');
            return;
        }

        const filterData = {
            name: formData.name.trim(),
            unit_measure: formData.unit_measure,
            type_unit_measure: formData.type_unit_measure
        };

        try {
            await onAddFilter(filterData);
            showSuccess('Фильтр успешно добавлен');
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении фильтра:', error);
            showError('Не удалось добавить фильтр');
        }
    };

    return (
        <div className={"add-filters"}>
            <div className={'add-filters-header'}>
                <ArrowBack onClick={onClose} className={"add-filters-header-icon"} />
                <div className={"add-filters-title"}>Добавления фильтра</div>
            </div>
            <div className={'add-filters-body'}>
                <div className={"input-item"}>
                    <label htmlFor="filters-name">Наименование</label>
                    <input
                        type="text"
                        placeholder={"Наименование"}
                        id={"filters-name"}
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, false)}
                        disabled={loading}
                    />
                </div>
                <div className={"input-item"}>
                    <label htmlFor="filters-unit_measure">Единицы измерения:</label>
                    <input
                        type="text"
                        placeholder={"Единицы измерения"}
                        id={"filters-unit_measure"}
                        value={formData.unit_measure}
                        onChange={(e) => handleInputChange(e, true)}
                        disabled={loading}
                    />
                </div>
                <div className={"input-item"}>
                    <label>Тип данных:</label>
                    <CustomSelect
                        items={itemsSelect}
                        type="add-filters-select"
                        placeholder={"Тип данных..."}
                        onChange={handleSelectChange}
                        value={formData.type_unit_measure}
                        isDisabled={loading}
                    />
                </div>
                <ButtonDefault
                    text={loading ? 'Сохранение...' : 'Сохранить'}
                    classButton={'add-filters-saveButton'}
                    onClick={handleSave}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default AddFiltersAdmin;