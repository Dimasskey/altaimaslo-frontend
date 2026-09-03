export const FAVORITES_KEY = 'user_favorites'

export const getFavorites = () => {
    if (typeof window !== 'undefined') {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : []
    }
}

const notifyFavoritesUpdate = () => {
    window.dispatchEvent(new Event('favoriteUpdated'))
}

export const addToFavorites = (productId) => {
    const favorites = getFavorites()

    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
        notifyFavoritesUpdate()
        return true
    }
    return false;
}

export const removeFromFavorites = (productId) => {
    const favorites = getFavorites().filter(id => id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    notifyFavoritesUpdate();
}

export const clearFavorites = () => {
    localStorage.removeItem(FAVORITES_KEY)
    notifyFavoritesUpdate();
}

export const isInFavorites = (productId) => {
    return getFavorites().includes(productId)
}

export const getFavoritesCount = () => {
    return getFavorites().length;
}