import React from 'react';
import "./usersDeliverePointsAdminStyles.scss"
import UsersDeliveryPointsItemAdmin from "@/entities/admin/usersDeliveryPointIsItem/ui/UsersDeliveryPointsItemAdmin";
import {useFetchUsersDeliveryPointsAdmin} from "../lib/useFetchUsersDeliveryPointsAdmin";

const UsersDeliveryPointsAdmin = () => {
    const {
        usersDeliveryPoints,
        loading,
        fetchUsersDeliveryPoints,
    } = useFetchUsersDeliveryPointsAdmin();

    const handleUpdate = () => {
        setTimeout(() => {
            fetchUsersDeliveryPoints();
        }, 350);
    }

    return (
        <div className="users-delivery-points-admin">
            <div className={"users-delivery-points-admin-header"}>
                <div className={"users-delivery-points-admin-title"}>
                    <div>№</div>
                    <div>Организация</div>
                    <div>Адрес</div>
                </div>
                <div className={"users-delivery-points-admin-count"}>
                    <span>Неподтверждённые</span>
                    {!loading && (
                        <div>{usersDeliveryPoints?.count_users_delivery_points || 0} шт</div>
                    )}
                </div>
            </div>

            <div className={`users-delivery-points-admin-body ${loading ? 'loading' : 'loaded'}`}>
                {loading ? (
                    <div className="users-delivery-points-admin-empty">
                        Загрузка адресов доставки выдачи...
                    </div>
                ) : usersDeliveryPoints?.users_delivery_points?.length > 0 ? (
                    usersDeliveryPoints.users_delivery_points.map((item, index) => (
                        <UsersDeliveryPointsItemAdmin
                            item={item}
                            index={index+1}
                            key={item.guid || index}
                            onUpdate={handleUpdate}
                        />
                    ))
                ) : (
                    <div className="users-delivery-points-admin-empty">
                        Нет адресов доставки
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersDeliveryPointsAdmin;