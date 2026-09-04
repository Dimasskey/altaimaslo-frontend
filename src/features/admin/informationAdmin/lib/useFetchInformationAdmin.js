import { useState, useCallback } from 'react';
import { RequestFetch } from "@shared/api/requestFetch";
import { useStatusModal } from "@/app/providers/statusModalProvider/statusModalProvider";

export const useFetchInformationAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [informations, setInformations] = useState([]);
    const [selectedInformation, setSelectedInformation] = useState(null);
    const { showError } = useStatusModal();

    const getAllInformation = useCallback(async () => {
        setLoading(true);

        RequestFetch({
            url: '/api/v1/information',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setInformations(res.data);
                    if (res.data.length > 0) {
                        setSelectedInformation(res.data[0]);
                    }
                }
                setLoading(false);
            },
            onError: () => {
                showError('Не удалось загрузить информацию');
                setLoading(false);
            }
        });
    }, [showError]);

    const getInformation = useCallback(async (id) => {
        if (!id) return;

        setLoading(true);

        RequestFetch({
            url: `/api/v1/information/${id}`,
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setSelectedInformation(res.data);
                }
                setLoading(false);
            },
            onError: () => {
                showError('Не удалось загрузить информацию');
                setLoading(false);
            }
        });
    }, [showError]);

    return {
        informations,
        selectedInformation,
        loading,
        getAllInformation,
        getInformation,
        setSelectedInformation
    };
};