import React from 'react';
import "./searchAdminStyles.scss"

const SearchAdmin = ({ searchTerm, onSearchChange, placeholder }) => {
    return (
        <div className="search-header-admin">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-header-admin__input"
            />
            <button className="search-header-admin__button">
                НАЙТИ
            </button>
        </div>
    );
};

export default SearchAdmin;