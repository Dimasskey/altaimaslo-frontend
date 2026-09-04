import React, {useRef, useState, useEffect} from 'react';
import "./usersItemAdmin.scss"
import UsersDetailInfo from "@/features/admin/usersAdmin/usersDetailInfo/ui/usersDetailInfo";
import {useGetDetailsUser} from "@/entities/admin/usersItem/lib/useGetDetailsUser";
import {useDeleteUserAdmin} from "@/entities/admin/usersItem/lib/useDeleteUserAdmin";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

const UsersItemAdmin = ({item, index, onUserDeleted, onUserUpdated}) => {
    const [openInfo, setOpenInfo] = useState(false);
    const {showConfirm} = useStatusModal();
    const infoRef = useRef(null);
    const editButtonRef = useRef(null);

    const {
        usersDetails,
        loading: detailsLoading,
        fetchUserDetails
    } = useGetDetailsUser()

    const {
        deleteUser,
        loading: deleteLoading,
    } = useDeleteUserAdmin(
        () => {
            if (onUserDeleted) {
                onUserDeleted();
            }
        }
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoRef.current &&
                !infoRef.current.contains(event.target) &&
                editButtonRef.current &&
                !editButtonRef.current.contains(event.target)) {
                setOpenInfo(false);
            }
        };

        if (openInfo) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openInfo]);

    function handelOpenInfoUsers(user_guid) {
        setOpenInfo(!openInfo);
        fetchUserDetails(user_guid)
    }

    function handleSaveUser(updatedUser) {
        setOpenInfo(false);
        if (onUserUpdated) {
            onUserUpdated();
        }
    }

    function handleCloseInfo() {
        setOpenInfo(false);
    }

    function handleDeleteUser(user_guid) {
        showConfirm(
            'Вы уверены, что хотите удалить этого пользователя?',
            'Подтверждение удаления',
            {
                onConfirm: () => deleteUser(user_guid),
                confirmText: 'Удалить',
                cancelText: 'Отмена'
            }
        );
    }

    return (
        <>
            <div className={'users-list-admin-page-item'} key={index}>
                <div className={"organization"} title={item.organization}>{item.organization}</div>
                <div>{item.email}</div>
                <div>{item.password}</div>
                <div
                    ref={editButtonRef}
                    className={'users-list-admin-page-item_button-info'}
                    onClick={() => handelOpenInfoUsers(item.guid)}
                >
                    Редактировать
                </div>
                <div
                    className={'users-list-admin-page-item_button-remove'}
                    onClick={() => handleDeleteUser(item.guid)}
                    disabled={deleteLoading}
                >
                    {deleteLoading ? 'Удаление...' : 'Удалить'}
                </div>
                {openInfo && (
                    <div ref={infoRef} className="user-detail-info-container">
                        <UsersDetailInfo
                            user={usersDetails}
                            onSave={handleSaveUser}
                            onClose={handleCloseInfo}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default UsersItemAdmin;