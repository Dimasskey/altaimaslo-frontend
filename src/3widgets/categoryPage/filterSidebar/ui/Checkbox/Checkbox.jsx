import React from 'react';

import "./checkbox.scss"

const Checkbox = ({id, label, onChange, checked}) => {
    return (
        <div className={'filter-checkbox'}>
            <input type={"checkbox"} id={id} className={'filter-checkbox__input'} onChange={() => onChange(!checked)} checked={checked} />
            <label htmlFor={id} className={'filter-checkbox__label'}>
                <span className={'filter-checkbox__mark'}></span>
                <span className={'filter-checkbox__text'}>{label}</span>
            </label>
        </div>
    );
};

export default Checkbox;