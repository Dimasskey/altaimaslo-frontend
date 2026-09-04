import React from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
    ADMIN_PANEL,
    SEARCH,
    MAIN,
    PRODUCT,
    CART,
    PROFILE,
    PROFILE_ORDERS,
    PROFILE_FAVORITES,
    PROFILE_ADDRESSES,
    PROFILE_ACCOUNT,
    USERS_ADMIN,
    CATEGORY_ADMIN,
    PROMO_SLIDER_ADMIN,
    PRODUCT_ADMIN,
    PAYMENT_METHOD_ADMIN,
    INFORMATION_ADMIN,
    USERS_DELIVERY_POINTS_ADMIN,
    FILTERS_ADMIN,
    CHECKOUT,
    INFORMATION,
    EDIT_PRODUCTS_ADMIN,
} from "@shared/constants/constatns";
import CategoryPage from "@/pages/public/categoryPage/ui/categoryPage";
import MainPage from "@/pages/public/mainPage/ui/mainPage";
import ProductPage from "@/pages/public/productPage/ui/ProductPage";
import AdminPages from "@/pages/admin/adminPage/ui/AdminPages";
import CartPage from "@/pages/public/cartPage/ui/cartPage";
import ProfilePage from "@/pages/public/profilePage/ui/profilePage";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import AdminRoute from "@shared/components/AdminRoute";
import OrderContent from "@/widgets/profile/ui/order/OrderContent";
import FavoritesContent from "@/widgets/profile/ui/favorites/FavoritesContent";
import AddressesContent from "@/widgets/profile/ui/addresses/AddressesContent";
import AccountContent from "@/widgets/profile/ui/account/AccountContent";
import UsersAdmin from "@/widgets/admin/usersAdmin/ui/UsersAdmin";
import PromoSliderAdmin from "@/widgets/admin/promoSliderAdmin/ui/PromoSliderAdmin";
import ProductsAdmin from "@/widgets/admin/productsAdmin/ui/ProductsAdmin";
import PaymentMethod from "@/widgets/admin/paymentMethodAdmin/ui/PaymentMethod";
import InformationAdmin from "@/widgets/admin/InformationAdmin/ui/InformationAdmin";
import CategoryAdmin from "@/widgets/admin/categoryAdmin/ui/CategoryAdmin";
import UsersDeliveryPointsAdmin from "@/widgets/admin/usersDeliveryPointsAdmin/ui/UsersDeliveryPointsAdmin";
import FiltersAdmin from "@/widgets/admin/filtersAdmin/ui/FiltersAdmin";
import CheckoutPage from "@/pages/public/checkoutPage/ui/CheckoutPage";
import InformationsPage from "@/pages/public/informationsPage/informationsPage";
import EditProductItemAdmin from "@/widgets/admin/editProductAdminItem/ui/EditProductItemAdmin";
import PublicLayout from "@/app/layout/PublicLayout";

const   Routing = () => {
    const location = useLocation();

    return (
        <Routes>
            {/* Публичные роуты — оборачиваем в PublicLayout */}
            <Route element={<PublicLayout />}>
                <Route path={SEARCH} element={<CategoryPage />} />
                <Route path={MAIN} element={<MainPage />} />
                <Route path={PRODUCT} element={<ProductPage />} />
                <Route path={`${INFORMATION}/:id`} element={<InformationsPage />} />

                {/* Защищенные маршруты */}
                <Route
                    path={CART}
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={CHECKOUT}
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={PROFILE}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                >
                    <Route path={PROFILE_ORDERS} element={<OrderContent />} />
                    <Route path={PROFILE_FAVORITES} element={<FavoritesContent />} />
                    <Route path={PROFILE_ADDRESSES} element={<AddressesContent />} />
                    <Route path={PROFILE_ACCOUNT} element={<AccountContent />} />
                    <Route path="" element={<Navigate to={PROFILE_ORDERS} replace />} />
                </Route>
            </Route>

            {/* Админские маршруты */}
            <Route
                path={ADMIN_PANEL}
                element={
                    <AdminRoute>
                        <AdminPages />
                    </AdminRoute>
                }
            >
                <Route path={USERS_ADMIN} element={<UsersAdmin />} />
                <Route path={CATEGORY_ADMIN} element={<CategoryAdmin />} />
                <Route path={PROMO_SLIDER_ADMIN} element={<PromoSliderAdmin />} />
                <Route path={PRODUCT_ADMIN} element={<ProductsAdmin />} />
                <Route path={PAYMENT_METHOD_ADMIN} element={<PaymentMethod />} />
                <Route path={INFORMATION_ADMIN} element={<InformationAdmin />} />
                <Route path={USERS_DELIVERY_POINTS_ADMIN} element={<UsersDeliveryPointsAdmin />} />
                <Route path={FILTERS_ADMIN} element={<FiltersAdmin />} />
                <Route path={EDIT_PRODUCTS_ADMIN} element={<EditProductItemAdmin />} />
                <Route path="" element={<Navigate to={PROMO_SLIDER_ADMIN} replace />} />
            </Route>
        </Routes>
    );
};

export default Routing;