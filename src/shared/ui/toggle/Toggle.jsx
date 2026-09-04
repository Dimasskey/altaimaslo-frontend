import React from 'react';
import "./toggleStyles.scss"

const Toggle = ({
                    onChange,
                    isActive = false
                }) => {
    const toggleClass = isActive ? "toggle mobile-selected" : "toggle pc-selected";

    return (
        <div className={toggleClass}>
            <input
                type="radio"
                id="toggle-pc"
                name="promo-toggle"
                checked={!isActive}
                onChange={() => onChange(false)}
            />
            <label htmlFor="toggle-pc">
                ПК версия
            </label>

            <input
                type="radio"
                id="toggle-mobile"
                name="promo-toggle"
                checked={isActive}
                onChange={() => onChange(true)}
            />
            <label htmlFor="toggle-mobile">
                Мобильная версия
            </label>
        </div>
    );
};

export default Toggle;