import React from 'react';
import ProductCard from "@/5entities/product/productCard/ui/ProductCard/ProductCard";
import AddToCart from "@/4features/addToCart/ui/AddToCart";
import AddToFavorites from "@/4features/addToFavorites/ui/AddToFavorites";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import StockStatus from "@shared/ui/StockStatus/StockStatus";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import ProductCardMobile from "@/5entities/product/productCard/ui/ProductCard/ProductCardMobile";

const ProductCardFull = ({
                             id,
                             image,
                             title,
                             oldPrice = null,
                             currentPrice,
                             unit,
                             stockStatus,
                             minQuantity,
                             isAlwaysStore,
                             loading,
                             cartButton = <AddToCart
                                 productId={id}
                                 className={'card-cart-button'}
                                 quantity={minQuantity}
                                 isAlwaysStore={isAlwaysStore}
                                 stockStatus={stockStatus}
                                 unit={unit}
                                 minQuantity={minQuantity}
                             />,
                             favoriteButton = <AddToFavorites productId={id} />,
                             editFunction,
                             editingButton = <ButtonDefault classButton={"product-card__edit"} text={"Редактировать"} onClick={editFunction}/>,
                             stockContainer = <StockStatus value={stockStatus} unit={unit} isAlwaysStore={isAlwaysStore}/>,
                             mobileInRow = false,
                             isEdited,
                             orderWrapper = null,

                         }) => {
    const navigate = useNavigate()
    const {user} = useAuth()
    const isMobile = useIsMobile()

    const isAuthenticated = !!user




    const handleCardClick = (e) => {
        if (e.target.closest('.product-card__button, .product-card-favorite, .product-card__edit')) {
            return
        }
        navigate(`/Product/${id}`)
    }

    return (
        <div onClick={handleCardClick}>
            {!mobileInRow
                ?   <ProductCard
                        id = {id}
                        image = {image}
                        title = {title}
                        oldPrice = {isAuthenticated ? oldPrice : null}
                        currentPrice = {isAuthenticated ? currentPrice : null}
                        unit = {isAuthenticated ? unit : null}
                        loading = {loading}
                        cartButton = {isAuthenticated ? cartButton : null}
                        favoriteButton ={isAuthenticated ? favoriteButton : null}
                        editingButton ={editingButton}
                        stockContainer ={isAuthenticated ? stockContainer : null}
                        authClass = {isAuthenticated ? '' : 'noauth'}
                        isAuth = {isAuthenticated}
                        isEdited={isEdited}
                        orderWrapper={orderWrapper}
                    />
                :   <ProductCardMobile
                        id = {id}
                        image = {image}
                        title = {title}
                        oldPrice = {isAuthenticated ? oldPrice : null}
                        currentPrice = {isAuthenticated ? currentPrice : null}
                        unit = {isAuthenticated ? unit : null}
                        loading = {loading}
                        cartButton = {isAuthenticated ? cartButton : null}
                        favoriteButton ={isAuthenticated ? favoriteButton : null}
                        editingButton ={editingButton}
                        stockContainer ={isAuthenticated ? stockContainer : null}
                        isAuth={isAuthenticated}
                    />
            }
        </div>
    );
};

export default ProductCardFull;