import React, { useState, useEffect } from 'react';

import "./searchHeaderAdmin.scss"

const SearchHeaderAdmin = ({ onSearchSubmit, initialSearchText = '' }) => {
    const [searchText, setSearchText] = useState(initialSearchText);

    useEffect(() => {
        setSearchText(initialSearchText);
    }, [initialSearchText]);

    const isButtonEnable = searchText && searchText.trim().length >= 3;

    const handleSearch = () => {
        if (isButtonEnable) {
            const trimmedText = searchText.trim();
            if (onSearchSubmit) {
                onSearchSubmit(trimmedText);
            }
        }
    }

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }

    const handleClearSearch = () => {
        setSearchText('');
        if (onSearchSubmit) {
            onSearchSubmit('');
        }
    }

    return (
        <div className="search-header-admin">
            <input
                type="text"
                placeholder="Найти товар"
                className="search-header-admin__input"
                value={searchText}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && isButtonEnable) {
                        handleSearch();
                    }
                }}
            />
            {searchText && (
                <button
                    className="search-header-admin__clear"
                    onClick={handleClearSearch}
                    aria-label="Очистить поиск"
                >
                    ×
                </button>
            )}
            <button
                className={`search-header-admin__button ${isButtonEnable ? 'enable' : 'disable'}`}
                onClick={handleSearch}
                disabled={!isButtonEnable}
            >
                НАЙТИ
            </button>
        </div>
    );
};

export default SearchHeaderAdmin;