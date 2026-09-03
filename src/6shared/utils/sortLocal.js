export const sortProducts = (products, method) => {
    if (!products || products.length === 0) return products

    console.log("products", products)

    switch (method) {
        case 'price_high':
            return [...products].sort((a,b) => b.currentPrice - a.currentPrice);
        case 'price_low':
            return [...products].sort((a,b) => a.currentPrice - b.currentPrice);
        case 'alphabetic':
            return [...products].sort((a,b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
        default:
            return products
    }
}