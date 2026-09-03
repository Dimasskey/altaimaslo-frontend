import React, { useState } from 'react';
import CartImg from "@shared/imges/svg/cartImg.svg?react";
import PlusImg from "@shared/imges/svg/plusImg.svg?react";
import CheckmarkImg from "@shared/imges/svg/CheckmarkSvg.svg?react";
import CrossImg from "@shared/imges/svg/closeSvg.svg?react";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import { useIsMobile } from "@shared/hooks/useIsMobile/useIsMobile";

import "./addToCartButton.scss";

const AddToCartButton = ({ onClick, className, disabled}) => {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <div
            className={`add-to-cart-wrapper ${disabled ? 'disabled' : ''}`}
            onMouseEnter={() => !isMobile && !disabled && setIsHovered(true)}
            onMouseLeave={() => !isMobile && !disabled && setIsHovered(false)}
        >
            <ButtonDefault
                onClick={handleClick}
                img1={PlusImg}
                img2={CartImg}
                classButton={
                    `add-to-cart-btn ${className} ${isMobile ? "" : "desktop"} ${disabled ? 'disabled' : ''}`
                }
            />
        </div>
    );
};

export default AddToCartButton;
