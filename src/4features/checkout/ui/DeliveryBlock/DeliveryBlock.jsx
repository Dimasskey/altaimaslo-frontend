import React from 'react';

import './deliveryBlock.scss'
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import {useCheckout} from "@/4features/checkout/model/CheckoutProvider";
import {useAddresses} from "@/4features/addresses/hooks/useAddresses";

const DeliveryBlock = () => {
    const {deliveryData, updateDeliveryData, setContactLoading} = useCheckout()
    const {addresses, getAddress} = useAddresses(true)

    const addressOptions = addresses.map((address) => ({
        value: address.guid,
        label: address.point_name,
    }))

    const handleAddressChange = async (addressGuid) => {
        updateDeliveryData({addressId: addressGuid})

        try {
            setContactLoading(true)
            const fullAddress = await getAddress(addressGuid)
            updateDeliveryData({contactData: fullAddress})
        } catch (error) {
            console.error('ошибка получения адреса', error)
        } finally {
            setContactLoading(false)
        }
    }

    const handleCommentChange = (e) => {
        updateDeliveryData({comment: e.target.value})
    }

    return (
        <div className={'delivery-block'}>
            <span className={'delivery-block-title'}>Доставка</span>
            <div className={'delivery-block-select'}>
                <label>Адрес доставки:</label>
                <CustomSelect
                    type={'border'}
                    items={addressOptions}
                    placeholder={'Выберите адрес доставки...'}
                    value={deliveryData.addressId}
                    onValueChange={handleAddressChange}
                    withSearch={true}
                />
            </div>
            <div className={'delivery-block-comment'}>
                <label>Комметарий:</label>
                <textarea
                    className={'delivery-block-comment__textarea'}
                    value={deliveryData.comment}
                    onChange={handleCommentChange}
                    rows={4}
                />
            </div>

        </div>
    );
};

export default DeliveryBlock;