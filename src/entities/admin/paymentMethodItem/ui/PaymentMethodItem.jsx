import React from 'react';
import "./paymentMethodItemStyles.scss"
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import {useFetchPaymentMethod} from "@/widgets/admin/paymentMethodAdmin/lib/useFetchPaymentMethod";

const PaymentMethodItem = ({ item, onEdit, onPaymentMethodDeleted, index }) => {
    const {showConfirm} = useStatusModal();

    const {
        deletePaymentMethod,
        loading: deleteLoading,
    } = useFetchPaymentMethod();

    function handleEditPaymentMethod() {
        if (onEdit) {
            onEdit(item);
        }
    }

    function handleDeletePaymentMethod(id) {
        showConfirm(
            'Вы уверены, что хотите удалить этот способ оплаты?',
            'Подтверждение удаления',
            {
                onConfirm: () => deletePaymentMethod(id).then(() => {
                    if (onPaymentMethodDeleted) {
                        onPaymentMethodDeleted();
                    }
                }),
                confirmText: 'Удалить',
                cancelText: 'Отмена'
            }
        );
    }

    return (
        <div className={'container_content'}>
            <div className={'container_content-count'}>{index + 1}</div>
            <div className={'container_content_info'}>
                <div className={'container_content-item'}>
                    <div className={"container_content-item--data"}>
                        <sapn>Наименование способа оплаты:</sapn>
                        <sapn>{item.name}</sapn>
                    </div>
                    <div className={"container_content-item--data"}>
                        <sapn>Комментарий: </sapn>
                        <sapn>{item.about ? item.about : 'Комментарий не указан'}</sapn>
                    </div>
                </div>
                <div className={'container_content_buttons-wrapper'}>
                    <div
                        className={'container_content-item_button-edit'}
                        onClick={handleEditPaymentMethod}
                    >
                        Редактировать
                    </div>
                    <div
                        className={'container_content-item_button-remove'}
                        onClick={() => handleDeletePaymentMethod(item.id)}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Удаление...' : 'Удалить'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodItem;