import { useState, useEffect } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useFetchSliderImgAdmin = () => {
    const [pcSliders, setPcSliders] = useState([])
    const [mobileSliders, setMobileSliders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { showSuccess, showError } = useStatusModal();

    const prepareSliders = (data) => {
        const sortedData = [...data].sort((a, b) => a.order_number - b.order_number);

        const pcItems = sortedData.map(item => ({
            ...item,
            type: 'pc'
        }));

        const mobileItems = sortedData.map(item => ({
            ...item,
            type: 'mobile'
        }));

        return { pcItems, mobileItems };
    }

    const fetchSlidersItems = async () => {
        setLoading(true)
        setError(null)

        try {
            await RequestFetch({
                url: '/api/v1/sliders',
                method: 'GET',
                onSuccess: async (res) => {
                    if (res?.data) {
                        const { pcItems, mobileItems } = prepareSliders(res.data)
                        setPcSliders(pcItems)
                        setMobileSliders(mobileItems)
                    }
                    setLoading(false)
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось загрузить слайды';
                    setError(errorMessage)
                    showError(errorMessage, 'Ошибка загрузки');
                    setLoading(false)
                }
            })
        } catch (error) {
            setLoading(false)
            showError('Ошибка при загрузке слайдов');
        }
    }

    const updateSlidersOrder = async (sliders) => {
        const updatedSliders = sliders.map((slider, index) => ({
            id: slider.id,
            attachment_guid_is_pc: slider.attachment_guid_is_pc,
            attachment_guid_is_mobile: slider.attachment_guid_is_mobile,
            order_number: index,
            url: slider.url || null
        }))

        try {
            await RequestFetch({
                url: '/api/v1/sliders',
                method: 'PATCH',
                body: updatedSliders,
                onSuccess: () => {
                    fetchSlidersItems();
                    showSuccess('Порядок слайдов успешно обновлен');
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось обновить порядок слайдов';
                    console.error('Ошибка при обновлении порядка:', errorMessage);
                    showError(errorMessage, 'Ошибка обновления');
                    fetchSlidersItems();
                }
            })
        } catch (error) {
            showError(`Ошибка при обновлении порядка слайдов: ${error}`);
            fetchSlidersItems();
        }
    }

    const addNewSlider = async (sliderData, type) => {
        const attachmentGuid = sliderData.attachment_guid || '00000000-0000-0000-0000-000000000000';

        const newSlider = {
            id: 0,
            attachment_guid_is_pc: attachmentGuid,
            attachment_guid_is_mobile: attachmentGuid,
            order_number: type === 'pc' ? pcSliders.length : mobileSliders.length,
            url: sliderData.url || null
        }

        try {
            await RequestFetch({
                url: '/api/v1/sliders',
                method: 'POST',
                body: newSlider,
                onSuccess: () => {
                    fetchSlidersItems();
                    showSuccess('Слайд успешно добавлен');
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось добавить слайд';
                    showError(errorMessage, 'Ошибка добавления');
                    fetchSlidersItems();
                }
            })
        } catch (error) {
            console.error('Error adding slider:', error)
            showError(`Ошибка при добавлении слайда: ${error}`);
            fetchSlidersItems();
        }
    }

    const deleteSlider = async (sliderId) => {
        try {
            await RequestFetch({
                url: `/api/v1/sliders/${sliderId}`,
                method: 'DELETE',
                onSuccess: () => {
                    fetchSlidersItems();
                    showSuccess('Слайд успешно удален');
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось удалить слайд';
                    showError(errorMessage, 'Ошибка удаления');
                    fetchSlidersItems();
                }
            })
        } catch (error) {
            showError(`Ошибка при удалении слайда: ${error}`);
            fetchSlidersItems();
        }
    }

    const updateSlider = async (sliderId, sliderData, type) => {
        const currentSlider = [...pcSliders, ...mobileSliders].find(slider => slider.id === sliderId);

        const updateData = {
            id: sliderId,
            attachment_guid_is_pc: type === 'pc'
                ? (sliderData.attachment_guid || '00000000-0000-0000-0000-000000000000')
                : (currentSlider?.attachment_guid_is_pc || '00000000-0000-0000-0000-000000000000'),
            attachment_guid_is_mobile: type === 'mobile'
                ? (sliderData.attachment_guid || '00000000-0000-0000-0000-000000000000')
                : (currentSlider?.attachment_guid_is_mobile || '00000000-0000-0000-0000-000000000000'),
            order_number: currentSlider?.order_number || 0,
            url: sliderData.url || null
        }

        try {
            await RequestFetch({
                url: `/api/v1/sliders`,
                method: 'PATCH',
                body: [updateData],
                onSuccess: () => {
                    fetchSlidersItems();
                    showSuccess('Слайд успешно обновлен');
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось обновить слайд';
                    showError(errorMessage, 'Ошибка обновления');
                    fetchSlidersItems();
                }
            });
        } catch (error) {
            showError(`Ошибка при обновлении слайда: ${error}`);
            fetchSlidersItems();
        }
    };

    useEffect(() => {
        fetchSlidersItems()
    }, [])

    return {
        pcSliders,
        mobileSliders,
        loading,
        error,
        fetchSlidersItems,
        updateSlidersOrder,
        updateSlider,
        addNewSlider,
        deleteSlider
    }
}