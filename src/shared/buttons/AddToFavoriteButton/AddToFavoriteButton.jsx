import React, { useState } from 'react';
import FavoriteIcon from "@shared/imges/svg/favorite.svg?react";
import FavoriteFilledIcon from "@shared/imges/svg/favoriteFilled.svg?react";
import { useIsMobile } from "@shared/hooks/useIsMobile/useIsMobile";
import "./addToFavoriteButton.scss";

const AddToFavoriteButton = ({ onClick, isInFavorites }) => {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {

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
            className={`product-card-favorite ${isMobile ? '' : 'desktop'}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isInFavorites ? (
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