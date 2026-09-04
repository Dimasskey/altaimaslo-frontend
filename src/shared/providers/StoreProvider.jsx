import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { RequestFetch } from "@shared/api/requestFetch";
import { useAuth } from "@/app/providers/authProvider/authProvider";

const DataHelper = {
    parseBasket: (str) => {
        if (!str) return [];
        return str.split(';')
            .filter(Boolean)
            .map(pair => {
                const [guid, q] = pair.split(':');
                return { id: guid, quantity: Number(q) || 0 };
            });
    },
    buildBasket: (items) => {
        return items.map(i => `${i.id}:${i.quantity}`).join(';') + ';';
    },
    parseFavorite: (str) => {
        if (!str) return [];
        return str.split(';').filter(Boolean);
    },
    buildFavorite: (ids) => {
        if (!ids || ids.length === 0) return '';
        return ids.join(";") + ';';
    }
};

export const StoreContext = createContext(null);

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within StoreProvider");
    }
    return context;
};

export const StoreProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({});

    const [isLoadingStore, setIsLoadingStore] = useState(true)

    const isItemLoading = useCallback(
        (id) => !!pendingRequests[id],
        [pendingRequests]
    );

    const fetchData = useCallback(async () => {
        if (!user) {
            setIsLoadingStore(false)
            return;
        };

        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'GET',
            onSuccess: (res) => {
                const srvCart = DataHelper.parseBasket(res?.data?.basket);
                const srvFavorite = DataHelper.parseFavorite(res?.data?.favorite);
                setCartItems(srvCart);
                setFavoriteItems(srvFavorite);
                setIsLoadingStore(false)
            },
            onError: () => {
                console.error('Ошибка загрузки данных с сервера');
            }
        });
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    const syncToServer = useCallback(async ({ newCart, newFav, itemId }) => {
        const loadingKey = itemId || 'global';
        setPendingRequests(prev => ({ ...prev, [loadingKey]: true }));

        const cartToSend = newCart !== undefined ? newCart : cartItems;
        const favToSend = newFav !== undefined ? newFav : favoriteItems;

        const body = {
            basket: DataHelper.buildBasket(cartToSend),
            favorite: DataHelper.buildFavorite(favToSend),
        };

        const resetLoading = () => {
            setPendingRequests(prev => {
                const next = { ...prev };
                delete next[loadingKey];
                return next;
            });
        };

        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'PATCH',
            body,
            onSuccess: () => {
                if (newCart !== undefined) {
                    setCartItems(newCart);
                }
                if (newFav !== undefined) {
                    setFavoriteItems(newFav);
                }
                resetLoading();
            },
            onError: () => {
                resetLoading();
                console.error('Ошибка синхронизации с сервером');
            }
        });
    }, [cartItems, favoriteItems]);

    const syncInvalidCart = useCallback(async (validCart) => {
        setCartItems(validCart);
        if (validCart.length === cartItems.length) return;
        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'PATCH',
            body: {
                basket: DataHelper.buildBasket(validCart),
                favorite: DataHelper.buildFavorite(favoriteItems),
            }
        });
    }, [favoriteItems, cartItems.length]);

    const syncInvalidFavorites = useCallback(async (validFav) => {
        setFavoriteItems(validFav);
        if (validFav.length === favoriteItems.length) return;
        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'PATCH',
            body: {
                basket: DataHelper.buildBasket(cartItems),
                favorite: DataHelper.buildFavorite(validFav),
            }
        });
    }, [cartItems, favoriteItems.length]);

    const addItem = useCallback((id, quantity = 1) => {
        const exists = cartItems.find(i => i.id === id);
        const nextCart = exists
            ? cartItems.map(i =>
                i.id === id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
            )
            : [...cartItems, { id, quantity }];
        syncToServer({ newCart: nextCart, itemId: id });
    }, [cartItems, syncToServer]);

    const updateItem = useCallback((id, quantity) => {
        const nextCart = cartItems.map(i =>
            i.id === id ? { ...i, quantity } : i
        );
        syncToServer({ newCart: nextCart, itemId: id });
    }, [cartItems, syncToServer]);

    const removeItem = useCallback((id) => {
        const nextCart = cartItems.filter(i => i.id !== id);
        syncToServer({ newCart: nextCart, itemId: id });
    }, [cartItems, syncToServer]);

    const clearCart = useCallback(() => {
        syncToServer({ newCart: [], itemId: 'global' });
    }, [syncToServer]);

    const toggleFavorite = useCallback((id) => {
        const isFav = favoriteItems.includes(id);
        const nextFav = isFav
            ? favoriteItems.filter(fid => fid !== id)
            : [...favoriteItems, id];
        syncToServer({ newFav: nextFav, itemId: id });
    }, [favoriteItems, syncToServer]);

    const clearFavorites = useCallback(() => {
        syncToServer({ newFav: [], itemId: 'global' });
    }, [syncToServer]);

    const isFavorite = useCallback(
        (id) => favoriteItems.includes(id),
        [favoriteItems]
    );

    const value = {
        cartItems,
        favoriteItems,
        refresh,
        loading: pendingRequests['global'] || false,
        isItemLoading,
        isLoadingStore,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        toggleFavorite,
        clearFavorites,
        isFavorite,

        syncInvalidCart,
        syncInvalidFavorites
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};