import React, { useState, useRef, useEffect } from "react";

import "./categoriesMainPage.scss";
import {useCategories} from "@/features/mainPage/categoryMainPage/model/useCategories";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {useImageLoading} from "@shared/hooks/useImageLoading";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useNavigate} from "react-router-dom";


const CategoriesMainPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const rowsRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("13vw");
    const navigate = useNavigate()

    const {categories, loading} = useCategories()
    const {handleLoad, isLoaded} = useImageLoading()
    const isMobile = useIsMobile()

    const shouldShowButton = categories.length > (isMobile ? 3 : 6)

    useEffect(() => {
        if (isExpanded && rowsRef.current) {
            const items = rowsRef.current.querySelectorAll('.categories-dropdown__item');
            if (items.length > 0) {
                const cols = isMobile ? 3 : 6
                const rowsCount = Math.ceil(items.length / cols);
                setMaxHeight(`calc(${rowsCount} * ${isMobile ? '36vw' : '12vw'} + 20px)`);
            }
        } else {
            setMaxHeight(isMobile ? "36vw" : "12vw");
        }
    }, [isExpanded, isMobile]);

    if (loading) {
        return (
            <div className={`categories-dropdown ${loading ? 'loading' : 'loaded'}`}>
                <div className="categories-dropdown__title">Категории</div>
                <div className="categories-dropdown__error">Загрузка...</div>
            </div>
        )
    }


    return (
        <div className="categories-dropdown">
            <div className="categories-dropdown__title">Категории</div>
            {categories.length === 0 ? (
                <div className="categories-dropdown__error">Категории не найдены</div>
            ) : (
                <>
                    <div
                        className={`categories-dropdown__rows ${isExpanded ? "expanded" : ""}`}
                        ref={rowsRef}
                        style={{ maxHeight }}
                    >
                        <div className="categories-dropdown__row">
                            {categories.map((category) => {
                                const loaded = isLoaded(category.id);
                                return (
                                <div key={category.id} className={`categories-dropdown__item`}
                                     onClick={() => navigate(`/search?categories_id=${category.id}&name=${encodeURIComponent(category.name)}`)}>
                                    <div className={`categories-dropdown__image ${loaded ? 'loaded' : 'loading'}`}>
                                        <img
                                            className={'categories-dropdown__img'}
                                            src={getAttachmentUrl(category.attachments_guid)}
                                            alt={category.name}
                                            onLoad={() => handleLoad(category.id)}
                                        />
                                    </div>
                                    <span className="categories-dropdown__name">{category.name}</span>
                                </div>
                                )})}
                        </div>
                    </div>
                    {shouldShowButton && (
                        <div className="categories-dropdown-button-wrapper">
                            <button
                                className="categories-dropdown__button"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? "Свернуть категории" : `Показать все ${categories.length} категорий`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoriesMainPage;