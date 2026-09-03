import {RequestFetch} from "@shared/api/requestFetch";

const serializeCart = (cart) => {
    if (!cart || !Array.isArray(cart)) return '';
    return cart.map(item => `${item.id}:${item.quantity}`).join(';')
}

const deserializeCart = (str) => {
    if (!str) return [];
    return str.split(';').map(item => {
        const [id, quantity] = item.split(':')
        return {id, quantity: parseInt(quantity, 10)}
    })
}

export const getBasket = async () => {
    try {
        let cartData = [];

        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'GET',
            onSuccess: (res) => {
                if (res?.basket) {
                    cartData = deserializeCart(res.basket)
                }
            },
            onError: (err) => {
                console.error('Ошибка загрузки корзины', err)
            }
        })
        return cartData;
    } catch (err) {
        console.error('Ошибка при получении корзины', err)
        return []
    }
}

export const updateBasket = async (cart) => {
    const serialized = serializeCart(cart)
    if (!serialized) {
        console.warn('Попытка обновить пустую корзину');
        return;
    }
    try {
        await RequestFetch({
            url: '/api/v1/favorite_basket',
            method: 'PATCH',
            body: {
                basket: serialized,
                favorite: ''
            },
            onSuccess: (res) => {
                console.log('✅ Корзина успешно обновлена на сервере:', res);
            },
            onError: (err) => {
                console.error('Ошибка обновления корзины на сервере:', err);
            }
        })
    } catch (err) {
        console.error(' Ошибка при обновлении корзины:', err);
        throw err;
    }
}