import {useEffect, useState} from "react";
import {getFavorites, getFavoritesCount} from "@shared/lib/favorites/localStorageFavorites";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState(getFavorites())
    const [favoritesCount, setFavoritesCount] = useState(getFavoritesCount())

    const updateFavorites = () => {
        setFavorites(getFavorites())
        setFavoritesCount(getFavoritesCount())
    }

    useEffect(() => {
        const handleFavoritesUpdate = () => {
            updateFavorites()
        }

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate)
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
    },[])

    return {
        favorites,
        favoritesCount,
        updateFavorites
    }
}

