import React from 'react';

import './actionsButtons.scss'
import AddToFavorites from "@/4features/addToFavorites/ui/AddToFavorites";
import TrashIcon from "@shared/imges/svg/trashSvg.svg?react";

const ActionsButtons = ({productId, showDelete, showFavorite, onRemove}) => {
    const shouldRender = showFavorite || showDelete

    if (!shouldRender) {
        return null;
    }

    return (
        <div className={'item-actions-buttons'}>
            {showFavorite && (
                <AddToFavorites productId={productId}/>
            )}
            {showDelete && (<div className={'item-actions-buttons__trash'}>
                <TrashIcon className="item-actions-buttons__trash-icon" onClick={onRemove}/>
            </div>)} 
        </div>
    );
};

export default ActionsButtons;