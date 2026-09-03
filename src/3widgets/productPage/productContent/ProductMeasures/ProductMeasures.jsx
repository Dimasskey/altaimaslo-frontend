import "./productMeasures.scss"

import React, {useEffect, useRef, useState} from 'react';
import ArrowSvg from "@shared/imges/svg/arrowBack.svg?react";
import { useIsMobile } from '@shared/hooks/useIsMobile/useIsMobile.jsx';


const ProductMeasures = ({measures}) => {
    const isMobile = useIsMobile();
    const [isExpanded, setExpanded] = useState(!isMobile);
    const containerRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    }

    useEffect(() => {
        if (isExpanded && containerRef.current) {
            const items = containerRef.current.querySelectorAll(".product-measures-item");

            if (items.length > 0) {
                const cols = isMobile ? 3 : 4;
                const rowsCount = Math.ceil(items.length / cols);

                const rowHeight = isMobile ? "15vw" : "10vw";

                const headerHeight = isMobile ? "11vw" : "2vw";

                setMaxHeight(`calc(${headerHeight} + ${rowsCount} * ${rowHeight} + 1vw)`);
            }
        } else {
            setMaxHeight(isMobile ? "11vw" : "2.1vw");
        }
    }, [isExpanded, isMobile]);

    if (measures?.length === 0) return null


    return (
        <div className={`product-measures ${isExpanded ? 'expanded' : ''}`}
             ref={containerRef} style={{ maxHeight, overflow: 'hidden' }}
        >
            <div className={'product-measures-header'}>
                <div className={'product-measures-header__title'}>Дополнительная информация</div>
                <div className={'product-measures-header-image'} onClick={toggleExpanded}>
                    <ArrowSvg className={`product-measures-header__img ${isExpanded ? 'open' : ''}`} />
                </div>
            </div>
            <div className={'product-measures-list'}  >
                {measures?.map((measure, index) => (
                    <div className={'product-measures-item'} key={index}>
                        <div className={'measure-item__name'}>{measure.name}</div>
                        <div className={'measure-item__value'}>{measure.value} {measure.unit_measure}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductMeasures;