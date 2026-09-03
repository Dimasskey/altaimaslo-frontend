import React, {useState} from 'react';

import AddToFavoriteButton from "@shared/buttons/AddToFavoriteButton/AddToFavoriteButton";
import {useStore} from "@shared/providers/StoreProvider";

const AddToFavorites = ({productId}) => {
    const {toggleFavorite, isFavorite, loading} = useStore()
    const isInFavorites = isFavorite(productId)

    const handleAddToFavorite = () => {
        toggleFavorite(productId)
    }

    return (
        <AddToFavoriteButton onClick={handleAddToFavorite} isInFavorites={isInFavorites}/>
    );
};
export default AddToFavorites;