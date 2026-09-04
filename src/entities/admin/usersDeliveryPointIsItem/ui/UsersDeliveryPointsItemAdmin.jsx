import "./usersDeliveryPointsItemAdminStyles.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import { useAcceptRejectedUsersDeliveryPointsPointsAdmin } from "@/entities/admin/usersDeliveryPointIsItem/lib/useAcceptRejectedUsersDeliveryPointsPointsAdmin";

const UsersDeliveryPointsItemAdmin = ( {item, index, onUpdate} ) => {
    const {
        loading,
        AcceptUsersDeliveryPointsPointsAdmin,
        RejectUsersDeliveryPointsPointsAdmin,
    }=useAcceptRejectedUsersDeliveryPointsPointsAdmin( item.guid, onUpdate )

    return (
        <div className={"usersDeliveryPointsItemAdmin"}>
            <div className={"usersDeliveryPointsItemAdmin-data"}>
                <div>{index}.</div>
                <div>{item.organization}</div>
                <div>{item.point_address}</div>
            </div>
            <div className={"buttons-container"}>
                <ButtonDefault
                    text={"Подтвердить"}
                    classButton={"button-accept"}
                    onClick={AcceptUsersDeliveryPointsPointsAdmin}
                    disabled={loading}
                />
                <ButtonDefault
                    text={"Отклонить"}
                    classButton={"button-reject"}
                    onClick={RejectUsersDeliveryPointsPointsAdmin}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default UsersDeliveryPointsItemAdmin;