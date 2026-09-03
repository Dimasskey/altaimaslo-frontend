import React, {useState} from 'react';
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from '@shared/imges/svg/plusSvg.svg?react'

import './addressesContent.scss'
import {useAddresses} from "@/4features/addresses/hooks/useAddresses";
import EmptyState from "@shared/ui/EmptyState/EmptyState";
import emptyAddresses from '@shared/imges/svg/emptyAddresses.svg'
import AddressesList from "@/4features/addresses/addressesList/AddressesList";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import AddressForm from "@/4features/addresses/addressForm/AddressForm";

const AddressesContent = () => {
    const [mode, setMode] = useState('list');
    const [editingAddress, setEditingAddress] = useState(null);
    const {showConfirm, showSuccess, showError, closeStatusModal} = useStatusModal()
    const {addresses, loading, removeAddress, addAddress, updateAddress, getAddress} = useAddresses()

    const handleAddAddress = () => {
        setMode('add');
        setEditingAddress(null);
    }

    const handleEditAddress = async (address) => {
        try {
            const fullAddress = await getAddress(address.guid);
            setMode('edit');
            setEditingAddress(fullAddress)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAddress = (guid) => {
        showConfirm(
            'Удаление адреса',
            'Вы точно хотите удалить адрес?',
            {
                onConfirm: async () => {
                    try {
                        await removeAddress(guid);
                        await closeStatusModal();
                        showSuccess('Адрес успешно удален!', 'Успех');
                    } catch (error) {
                        await closeStatusModal();
                        showError(error?.message || 'Ошибка удаления')
                    }
                },
                onCancel: async () => {
                    await closeStatusModal()
                }
            },
        )
    }

    const handleCancel = () => {
        setMode('list');
        setEditingAddress(null);
    }

    const handleSave = async (formData) => {

        try {
            if (mode === 'add') {
                await addAddress(formData)
            } else if (mode === 'edit' && editingAddress) {
                await updateAddress(editingAddress.guid, formData)
            }
            setMode('list')
            setEditingAddress(null)
        } catch (error) {
            console.log(error)
        }
    }

    if (mode === 'edit' || mode === 'add') {
        return (
            <AddressForm
                mode={mode}
                address={editingAddress}
                onCancel={handleCancel}
                onSave={handleSave}
            />
        )
    }

    return (
        <div className={`addresses ${addresses.length === 0 && 'empty'} ${loading ? 'loading' : 'loaded'}`} style={{height: `${loading ? '15vw' : ''}`}}>
            {addresses.length === 0 ? (
                <EmptyState
                    description={'Добавте адреса доставки, чтобы упростить оформление заказов'}
                    title={'Адреса доставки'}
                    image={emptyAddresses}
                    buttonText={'Добавить адрес доставки'}
                    customButtonAction={handleAddAddress}
                />

            ) : (
                <AddressesList
                    addresses={addresses}
                    onAddAddress={handleAddAddress}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={handleDeleteAddress}
                />
            )}
        </div>
    )
}

export default AddressesContent;