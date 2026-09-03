import React, {useState} from 'react';

import "./searchHeader.scss"
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";
import {useNavigate} from "react-router-dom";

const SearchHeader = ({isSearchOpen, onCloseSearch}) => {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const isButtonEnable = searchText && searchText.trim().length >= 3;

    const handleSearch = () => {
        if (isButtonEnable) {
            navigate(`/search?text=${encodeURIComponent(searchText)}`);
        }
    }

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <>
            {isSearchOpen && (
                <ArrowBack className={'search-header-back'} onClick={onCloseSearch} />
            )}
            <div className="search-header">

                <input type="text"
                       placeholder="Найти товар"
                       className="search-header__input"
                       value={searchText}
                       onChange={handleInputChange}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter' && isButtonEnable) {
                               handleSearch()
                           }
                       }}
                />
                <button className={`search-header__button ${isButtonEnable ? 'enable' : 'disable'}`} onClick={handleSearch} disabled={!isButtonEnable}>
                    НАЙТИ
                </button>
            </div>
        </>
    );
};

export default SearchHeader;