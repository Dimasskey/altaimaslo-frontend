import React from 'react';

import './categoriesDropdown.scss'
import {useCategories} from "@/features/mainPage/categoryMainPage/model/useCategories";
import {useImageLoading} from "@shared/hooks/useImageLoading";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useNavigate} from "react-router-dom";
import {useScrollShadow} from "@shared/hooks/useScrollShadow/useScrollShadow";

const CategoriesDropdown = ({onClose}) => {
    const {categories, loading} = useCategories()
    const navigate = useNavigate();
    const {handleLoad, isLoaded} = useImageLoading()
    const isMobile = useIsMobile()

    const {ref: listRef, hasShadow} = useScrollShadow(categories)


    return (
        <div className={`header-categories-dropdown ${isMobile ? "mobile" : ""}`}>
            {isMobile ? (<span className={'categories-dropdown__title'}>Категории</span>) : null}
            <div className={`header-categories-dropdown-items ${hasShadow ? 'shadow' : ''}`} ref={listRef}>
                {categories.map((category) =>{
                    const loaded = isLoaded(category.id)
                    return (
                        <div
                            key={category.id}
                            className={`header-categories-dropdown__item ${isMobile ? 'mobile' : ''} ${!isMobile ? loaded ? 'loaded' : 'loading' : loading ? 'loading' : 'loaded'}`}
                            onClick={() => {
                                const newUrl = `/search?categories_id=${category.id}&name=${encodeURIComponent(category.name)}`
                                navigate(newUrl)
                                onClose()
                            }}

                        >
                            <div className={`header-categories-dropdown__image `}>
                                <img
                                    className={'header-categories-dropdown__img'}
                                    src={getAttachmentUrl(category.attachments_guid)}
                                    alt=""
                                    onLoad={() => handleLoad(category.id)}
                                />
                            </div>
                            <span className={`header-categories-dropdown__name ${isMobile ? 'mobile' : ''}`}>{category.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CategoriesDropdown;