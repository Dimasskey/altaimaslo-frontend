import "./categoryItemAdminStyles.scss"
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import DragHandle from "@shared/imges/svg/dragnDrop.svg?react";

const CategoryItemAdmin = ({ id, name, myKey, img, myOnClik, onDelete, dragHandleProps }) => {
    return (
        <div className={'category_admin-item'} id={id} key={myKey}>
            <div className={'category_admin-item_dragHandle'} {...dragHandleProps}>
                <DragHandle />
            </div>
            <div className={'category_admin-item-content'}>
                <div className={'category_admin-item_ImgAndName'}>
                    <img className={'category_admin-item_ImgAndName-Img'} src={getAttachmentUrl(img)} alt={name} />
                    <span className={'category_admin-item_ImgAndName-Name'}>{name}</span>
                </div>
                <div className={'category_admin-item_RedactAndRemove'}>
                    <span className={'category_admin-item_RedactAndRemove-Redact'} onClick={myOnClik}>Редактировать</span>
                    <span className={'category_admin-item_RedactAndRemove-Remove'} onClick={onDelete}>Удалить</span>
                </div>
            </div>
        </div>
    );
};

export default CategoryItemAdmin;