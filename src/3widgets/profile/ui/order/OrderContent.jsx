import React, { useState } from 'react';
import './orderContent.scss';
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import pdf from '@shared/imges/svg/pdfSvg.svg'
import checkmark from '@shared/imges/svg/CheckmarkSvg.svg'
import emptyCart from '@shared/imges/svg/emptyCart.svg'
import EmptyState from "@shared/ui/EmptyState/EmptyState";
import {useAddresses} from "@/4features/addresses/hooks/useAddresses";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useOrders} from "@shared/hooks/useOrders/useOrders";

const OrderContent = () => {
    const {addresses} = useAddresses(true)
    const isMobile = useIsMobile()
    const addressOptions = addresses.map((address) => ({
        value: address.guid,
        label: address.point_address,
    }))
    const selectOptions = [
        {value: null, label: 'Все торговые точки'},
        ...addressOptions
    ]
    const [selectedAddress, setSelectedAddress] = useState(null)
    const {orders, loading } = useOrders(selectedAddress)
    const [downloadedOrders, setDownloadedOrders] = useState(new Set())

    if (selectedAddress === null && orders.length === 0 && !loading) {
        return <EmptyState
            title={'Мои заказы'}
            image={emptyCart}
            description={'Здесь будет храниться история ваших заказов.'}
        />
    }

    const downloadPDF = async (orderId, orderNumber) => {
        const url = `/api/v1/orders/doc/${orderId}`;
        const filename = `Заказ_${orderNumber}.pdf`

        try {
            const response = await fetch('https://altaizakaz.ru' + url, {
                method: 'GET',
                credentials: 'include',
            })
            const blob = await response.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href);

            setDownloadedOrders(prev => {
                const newSet = new Set(prev);
                newSet.add(orderId);
                return newSet;
            });

        } catch (error) {
            console.error('Ошибка скачивания PDF', error)
            alert('Не удалось скачать PDF. Попробуйте позже.');
        }
    }

    return (
        <div className={`orders ${loading ? "loading" : 'loaded'}`}>
            <div className={'orders-header'}>
                <div className={'orders-title'}>Мои заказы</div>
                <CustomSelect
                    placeholder={'Все торговые точки'}
                    withSearch={true}
                    items={selectOptions}
                    type={'border'}
                    value={selectedAddress}
                    onChange={(value) => {setSelectedAddress(value)}}
                />
            </div>

            {selectedAddress !== null && orders.length === 0 ? (
                <div className="orders-table">
                    <div className="orders-table-body">
                        <div className="orders-table-empty">
                            Нет заказов на выбранной торговой точке.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="orders-table">
                    {!isMobile && (
                        <div className="orders-table-header">
                            <div className="orders-table-column">Дата и время</div>
                            <div className="orders-table-column">Номер заказа</div>
                            <div className="orders-table-column">Статус</div>
                            <div className="orders-table-column">Сумма</div>
                            <div className="orders-table-column">Счет</div>
                        </div>
                    )}
                    <div className="orders-table-body">
                        {orders.map(order => (
                            !isMobile ? (
                                <div key={order.id} className="orders-table-row">
                                    <div className="orders-table-cell">{order.date}</div>
                                    <div className="orders-table-cell">{order.orderNumber}</div>
                                    <div className="orders-table-cell">
                                        <span
                                            className={`status status`}
                                            style={{
                                                backgroundColor: `${order.status_color}`,
                                                color: '#fff'
                                            }}
                                        >
                                            {order.status_name}
                                        </span>
                                    </div>
                                    <div className="orders-table-cell">{order.amount}</div>
                                    <div className="orders-table-cell">
                                        <div
                                            className={`pdf-icon ${
                                                downloadedOrders.has(order.id) ? 'pdf-icon--done' : ''
                                            }`}
                                            onClick={() => {
                                                if (order.status_id === 2 && !downloadedOrders.has(order.id)) {
                                                    downloadPDF(order.id, order.orderNumber);
                                                }
                                            }}
                                            style={{
                                                cursor: order.status_id !== 2 || downloadedOrders.has(order.id) ? 'default' : 'pointer'
                                            }}
                                        >
                                            <img
                                                src={pdf}
                                                className="pdf-icon__pdf"
                                                style={{
                                                    filter: order.status_id !== 2 ? 'grayscale(1)' : 'none',
                                                }}
                                            />
                                            <img src={checkmark} className="pdf-icon__check"/>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={order.id} className={'order-mobile'}>
                                    <div className={'order-mobile-left'}>
                                        <div className={'order-mobile__number'}>{order.orderNumber}</div>
                                        <div className={'order-mobile__date'}>{order.date}</div>
                                        <span
                                            className={`order-mobile__status status`}
                                            style={{
                                                backgroundColor: `${order.status_color}`,
                                                color: '#fff'
                                            }}
                                        >
                                            {order.status_name}
                                        </span>
                                    </div>
                                    <div className={'order-mobile-right'}>
                                        <div className={'order-mobile__amount'}>{order.amount}</div>
                                        {order.status_id === 2 && (
                                            <div className={'order-mobile__download'}>
                                                <div
                                                    className={`pdf-icon ${
                                                        downloadedOrders.has(order.id) ? 'pdf-icon--done' : ''
                                                    }`}
                                                    onClick={() => {
                                                        if (!downloadedOrders.has(order.id)) {
                                                            downloadPDF(order.id, order.orderNumber);
                                                        }
                                                    }}
                                                >
                                                    <img src={pdf} className="pdf-icon__pdf"/>
                                                    <img src={checkmark} className="pdf-icon__check"/>
                                                </div>
                                                <button
                                                    onClick={() => downloadPDF(order.id, order.orderNumber)}
                                                    className={'order-mobile__download-text'}
                                                >
                                                    скачать счёт
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderContent;