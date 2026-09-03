import React from 'react';

import FavoriteIconSvg from "@shared/imges/svg/favorite.svg?react"
import {Link, NavLink} from "react-router-dom";
import {PROFILE_FAVORITES} from "@shared/constants/constatns";
import {useStore} from "@shared/providers/StoreProvider";
const FavoriteIcon = () => {
    const {favoriteItems} = useStore()

    return (
        <Link className={'header-favorites'} to={`/profile/${PROFILE_FAVORITES}`} replace>
            {favoriteItems.length > 0 && (
                <div className={"header-favorites__count"}>{favoriteItems.length}</div>
            )}
            <FavoriteIconSvg className="favorite-icon" />
        </Link>
    );
};

export default FavoriteIcon;