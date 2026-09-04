import React, { useState, useCallback, useEffect } from 'react';
import TrashImg from "@shared/imges/svg/trashSvg.svg?react";

const PoductMesureAdminItem = ({ measure, index, onRemove, onValueChange }) => {

    const [value, setValue] = useState(measure?.value || '');

    useEffect(() => {
        setValue(measure?.value || '');
    }, [measure?.value]);

    const handleValueChange = useCallback((event) => {
        const newValue = event.target.value;
        setValue(newValue);

        if (onValueChange) {
            onValueChange(measure.id, newValue);
        }
    }, [measure.id, onValueChange]);

    const handleBlur = useCallback(() => {
        if (onValueChange && value !== measure?.value) {
            onValueChange(measure.id, value);
        }
    }, [measure.id, value, measure?.value, onValueChange]);

    const handleRemove = useCallback(() => {
        if (onRemove) {
            onRemove(measure.id);
        }
    }, [measure.id, onRemove]);

    return (
        <div className={'product-measures-admin-item'} key={index}>
            <div className={'measure-item__name'}>{measure?.name}</div>
            <div className={'measure-item__value'}>
                <input
                    type={measure?.type_unit_measure}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleBlur}
                    placeholder="Значение"
                />
                <span>
                    {measure?.unit_measure}
                </span>
            </div>
            {onRemove && (
                <div
                    className={'measure-item__remove'}
                    onClick={handleRemove}
                    title="Удалить фильтр"
                >
                    <TrashImg/>
                </div>
            )}
        </div>
    );
};

export default React.memo(PoductMesureAdminItem);