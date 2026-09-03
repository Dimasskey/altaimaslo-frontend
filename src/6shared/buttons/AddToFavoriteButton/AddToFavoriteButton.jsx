import React, { useState } from 'react';
import FavoriteIcon from "@shared/imges/svg/favorite.svg?react";
import FavoriteFilledIcon from "@shared/imges/svg/favoriteFilled.svg?react";
// Импортируем хук, как в кнопке корзины
import { useIsMobile } from "@shared/hooks/useIsMobile/useIsMobile";
import "./addToFavoriteButton.scss";

const AddToFavoriteButton = ({ onClick, isInFavorites }) => {
    const isMobile = useIsMobile(); // Определяем устройство
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        // Блокируем hover-эффект на мобильных
        if (!isMobile) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false);
        }
    };

    return (
        <div
            // Добавляем класс 'desktop', если это не мобильное устройство
            className={`product-card-favorite ${isMobile ? '' : 'desktop'}`}
            onClick={(e) => {
                e.stopPropagation(); // Хорошая практика предотвращать всплытие клика
                onClick();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isInFavorites ? (
                // Логика смены иконки сработает только на десктопе,
                // так как на мобильном isHovered всегда false
                isHovered ? (
                    <FavoriteFilledIcon className={'product-card-favorite__icon product-card-favorite__icon--remove'} />
                ) : (
                    <FavoriteFilledIcon className={'product-card-favorite__icon product-card-favorite__icon--active'} />
                )
            ) : (
                <FavoriteIcon className={'product-card-favorite__icon'} />
            )}
        </div>
    );
};

export default AddToFavoriteButton;