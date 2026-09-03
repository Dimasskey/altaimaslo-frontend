import React, { useState, useEffect } from 'react';
import "./editFiltersAdminStyles.scss"
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import { useStatusModal } from '@/1app/providers/statusModalProvider/statusModalProvider';

const EditFilters = ({ onSave, filter = null, position = 'bottom' }) => {
    const { showError } = useStatusModal();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        unit_measure: '',
        type_unit_measure: ''
    });

    const itemsSelect = [
        { label: "число", value: "number" },
        { label: "строка", value: "string" },
    ];

    useEffect(() => {
        if (filter) {
            setFormData({
                name: filter.name || '',
                unit_measure: filter.unit_measure || '',
                type_unit_measure: filter.type_unit_measure || ''
            });
        }
    }, [filter]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id.replace('filters-', '');

        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSelectChange = (selectedValue) => {
        setFormData(prev => ({
            ...prev,
            type_unit_measure: selectedValue || ''
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
        if (!formData.type_unit_measure.trim()) {
            showError('Пожалуйста, выберите тип данных', 'Ошибка валидации');
            return;
        }

        setLoading(true);
        try {
            const filterData = {
                name: formData.name.trim(),
                unit_measure: formData.unit_measure,
                type_unit_measure: formData.type_unit_measure,
                order_number: filter?.order_number || 1
            };
            if (onSave) {
                await onSave(filterData);
            }
        } catch (error) {
            console.error('Ошибка при сохранении фильтра:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={`edit-filters ${position === 'top' ? 'edit-filters--top' : ''}`}>

            <div className={`edit-filters-arrow ${position === 'top' ? 'edit-filters-arrow--top' : ''}`}></div>

            <div className={'edit-filters-header'}>
                <div className={"edit-filters-title"}>Редактирование фильтра "{formData.name}"</div>
            </div>
            <div className={'edit-filters-body'}>
                <div className={"input-item"}>
                    <label htmlFor="filters-name">Наименование:</label>
                    <input
                        type="text"
                        placeholder={"Наименование"}
                        id={"filters-name"}
                        value={formData.name}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>
                <div className={"input-item"}>
                    <label>Тип данных:</label>
                    <CustomSelect
                        items={itemsSelect}
                        type="edit-filters-select"
                        placeholder={"Тип данных..."}
                        onChange={handleSelectChange}
                        value={formData.type_unit_measure}
                        isDisabled={loading}
                    />
                </div>
            </div>
            <ButtonDefault
                text={loading ? 'Сохранение...' : 'Сохранить'}
                classButton={'edit-filters-saveButton'}
                onClick={handleSave}
                disabled={loading}
            />
        </div>
    );
};

export default EditFilters;