import React, {useState} from 'react';
import "./usersAdminStyles.scss"

import {useUsersAdmin} from "@/3widgets/admin/usersAdmin/lib/useUsersAdmin";
import UsersItemAdmin from "@/5entities/admin/usersItem/ui/UsersItemAdmin";
import SearchAdmin from "@shared/ui/SearchAdmin/SearchAdmin";

const UsersAdmin = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const {
        users,
        loading,
        fetchUsers,
    } = useUsersAdmin();


    const handleUserDeleted = () => {
        fetchUsers();
    };

    const handleUserUpdated = () => {
        fetchUsers();
    };

    const filteredUsers = users?.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className={'users-list-admin-page-wrapper'}>
                <div className={'users-list-admin-page-header'}>
                    Пользователи
                    <SearchAdmin
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Поиск пользователей..."}
                    />
                </div>
                <div className={'users-list-admin-page-under_header'}>
                    <div>Организация</div>
                    <div>Почта</div>
                    <div>Пароль</div>
                </div>
                {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((item, index) => {
                        return (
                            <UsersItemAdmin
                                item={item}
                                key={index}
                                index={index}
                                onUserDeleted={handleUserDeleted}
                                onUserUpdated={handleUserUpdated}
                            />
                        )
                    })
                ) : (
                    <div className={`users-admin-empty ${loading ? 'loading' : 'loaded'}`}>
                        {searchTerm ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
                    </div>
                )}
            </div>
        </>
    );
};

export default UsersAdmin;