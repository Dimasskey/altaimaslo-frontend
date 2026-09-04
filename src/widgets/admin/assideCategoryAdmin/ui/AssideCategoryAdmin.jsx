import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, createSearchParams} from "react-router-dom";
import AsideCategoryItem from "@/entities/admin/asideCategoryItem/ui/AsideCategoryItem";
import {useFetchCategories} from "@shared/hooks/useCategoryAdmin/useFetchCategories";

const AssideCategoryAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {categories, loading} = useFetchCategories();
    const [activeCategory, setActiveCategory] = useState(null);

    const handleClearCategory = () => {
        setActiveCategory(null);
        navigate({
            pathname: location.pathname,
            search: '',
        });
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        setActiveCategory(categoryId);
        updateUrlWithCategory(categoryId, categoryName);
    };

    const updateUrlWithCategory = (categoryId, categoryName) => {
        const searchParams = createSearchParams({
            categories_id: categoryId.toString(),
            category_name: encodeURIComponent(categoryName),
        });

        navigate({
            pathname: location.pathname,
            search: `?${searchParams.toString()}`,
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const currentCategoryId = searchParams.get("categories_id");

        if (currentCategoryId) {
            setActiveCategory(parseInt(currentCategoryId));
        } else {
            setActiveCategory(null);
        }
    }, [location.search, categories]);

    return (
        <aside className={`aside_menu ${loading ? 'loading' : 'loaded'}`}>
            <div className={"aside_menu-title"}>Категории</div>
            <ul className={"aside_menu-list"}>
                <div
                    className={`aside_menu-item ${!activeCategory ? 'active' : ''}`}
                    onClick={handleClearCategory}
                    style={{cursor: 'pointer'}}
                >
                    Все товары
                </div>

                {categories.map((item) => (
                    <AsideCategoryItem
                        key={item.id}
                        item={item}
                        classNameProps={`aside_menu-item ${activeCategory === item.id ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(item.id, item.name)}
                    />
                ))}
            </ul>
        </aside>
    );
};

export default AssideCategoryAdmin;