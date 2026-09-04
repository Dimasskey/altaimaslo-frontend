import React from 'react';
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useNavigate} from "react-router-dom";

import './emptyState.scss'

const EmptyState = ({
    image,
    title,
    description,
    buttonText = "Продолжить покупки",
    customButtonAction
                    }) => {
    const navigate = useNavigate()

    const handleClickButton = () => {
        if (customButtonAction) {
            customButtonAction()
        } else {
            navigate('/')
        }
    }

    return (
        <div className={'empty-state'}>
            <div className={'empty-state__image'}>
                <img src={image} />
            </div>
            <div className={'empty-state__title'}>
                {title}
            </div>
            <div className={'empty-state__description'}>
                {description}
            </div>
            <ButtonDefault
                onClick={handleClickButton}
                text={buttonText}
                classButton={'empty-state__button'}
            />
        </div>
    );
};

export default EmptyState;