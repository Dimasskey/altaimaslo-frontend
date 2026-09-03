import React, {useState} from 'react';
import "@shared/styles/asideMenuAdminStyles.scss"
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";

const AsideCategoryItem = ( { item, classNameProps, onClick } ) => {
    const [imgLoading, setImgLoading] = useState(false)

    return (
        <div
            className={`aside_category_item ${classNameProps}`}
            onClick={onClick}
        >
            <div style={{width:'2vw', height:'2vw'}} className={`${imgLoading ? 'loaded' : 'loading'}`}>
                <img className={`aside_category_item-img`}
                     onLoad={() => setImgLoading(true)}
                     src={getAttachmentUrl(item.attachments_guid)}
                     alt={item.name}
                     style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
            <div>{item.name}</div>
        </div>
    );
};

export default AsideCategoryItem;