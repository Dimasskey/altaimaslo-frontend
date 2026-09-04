import React from 'react';

import "./stockStatus.scss";

const StockStatus = ({value, isAlwaysStore}) => {
    if (isAlwaysStore) {
        return null;
    }

    if (value <= 0) {
        return (
            <div className={`stock_status out-of-stock`}>
                <span className={'stock_status-big'}>НЕТ</span>
                <span className={'stock_status-small'}>в наличии</span>
            </div>
        );
    }

    return null;
};

export default StockStatus;