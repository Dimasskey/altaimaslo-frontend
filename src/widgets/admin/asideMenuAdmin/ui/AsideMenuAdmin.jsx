import {Link, useLocation} from "react-router-dom";
import "@shared/styles/asideMenuAdminStyles.scss"
import AssideCategoryAdmin from "@/widgets/admin/assideCategoryAdmin/ui/AssideCategoryAdmin";

const AsideMenuAdmin = () => {
    const location = useLocation();

    const dataMass = [
        {id:1,name: "Промо", path: "/adminPanel/promoSliderAdmin"},
        {id:2,name: "Товары", path: "/adminPanel/productAdmin"},
        {id:3,name: "Пользователи", path: "/adminPanel/usersAdmin"},
        /*{id:4,name: "Способ оплаты", path: "/adminPanel/paymentMethodAdmin"},*/
        {id:5,name: "Информация", path: "/adminPanel/informationAdmin"},
        {id:6,name: "Категории", path: "/adminPanel/categoryAdmin"},
        {id:7,name: "Фильтры", path: "/adminPanel/filterAdmin"},
        {id:8,name: "Адрес доставки", path: "/adminPanel/usersDeliveriesPointsAdmin"},
    ];

    const isActive = (path) => {
        if (location.pathname === '/adminPanel/*' && path === '/adminPanel/promoSliderAdmin') {
            return true;
        }
        return location.pathname.startsWith(path);
    };
    
    const isProductsActive =
        location.pathname.startsWith("/adminPanel/productAdmin") ||
        location.pathname.includes("/adminPanel/editProductAdmin");

    return (
        <>
            <aside className={"aside_menu"}>
                <div className={"aside_menu-title"}>Панель управления</div>
                <ul className={"aside_menu-list"}>
                    {dataMass.map((item) => (
                        <Link
                            id={item.id}
                            key={item.id}
                            to={item.path}
                            className={`aside_menu-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </ul>
            </aside>

            {isProductsActive && (
                <AssideCategoryAdmin />
            )}
        </>
    );
};

export default AsideMenuAdmin;