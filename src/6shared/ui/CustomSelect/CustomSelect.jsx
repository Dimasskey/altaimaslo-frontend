import React, { useEffect, useRef, useState } from 'react';

import ArrowSvg from "@shared/imges/svg/arrowSvg.svg?react"

import "./customSelect.scss"

const CustomSelect = ({
    items,
    type = '',
    withSearch = false,
    onChange = () => {},
    placeholder,
    value: controllerValue,
    onValueChange,

}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(items[0]?.value || '')
    const [searchText, setSearchText] = useState('')
    const ref = useRef(null);

    const currentValue = controllerValue !== undefined || null ? controllerValue : selectedValue

    const currentLabel = items.find(item => item.value === currentValue)?.label || placeholder;


    const filteredItems = searchText
        ? items.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()))
        : items;


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSelect = (item) => {
        const newValue = item.value
        if (onValueChange) {
            onValueChange(newValue)
        } else {
            setSelectedValue(newValue)
        }
        setIsOpen(false)
        setSearchText('')
        onChange(newValue)
    }

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <div className={`custom-select ${type}`} ref={ref}>
            <div className={'custom-select__button'} onClick={() => setIsOpen(!isOpen)}>
                {isOpen && withSearch ? (
                    <input
                        type="text"
                        className="custom-select__input"
                        value={searchText}
                        onChange={handleInputChange}
                        placeholder="Поиск..."
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <>
                        <span className={`custom-select__button-selected`}>
                            {currentLabel}
                        </span>

                    </>
                )}
                <ArrowSvg className={`custom-select__arrow ${isOpen ? "open" : ''}`} />
            </div>
            {isOpen && (
                <div className={`custom-select__options ${isOpen ? "open" : ''}`} >
                    {filteredItems.map((item) => (
                        <div
                            key={item.value}
                            className={`custom-select__option ${item.value === currentValue ? 'selected' : ''}`}
                            onClick={() => handleSelect(item)}
                            title={item.label}
                        >
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default CustomSelect;