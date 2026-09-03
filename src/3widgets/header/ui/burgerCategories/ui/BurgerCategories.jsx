import React from 'react';

import "./burgerCategories.scss"
import BurgerIcon from '@shared/imges/svg/burgerIcon.svg'


const BurgerCategories = ({withText}) => {

    return (
        <div className="burger-categories">
            <img src={BurgerIcon} className={'burger-img'}/>
            {withText ? (<div className="burger-name">КАТАЛОГ</div>) : ''}
        </div>

    );
};

export default BurgerCategories;