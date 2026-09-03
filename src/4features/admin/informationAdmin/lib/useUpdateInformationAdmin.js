import { useState, useCallback } from 'react';
import { RequestFetch } from "@shared/api/requestFetch";
import { useStatusModal } from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useUpdateInformationAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const { showError, showSuccess } = useStatusModal();

    const updateInformation = useCallback(async (id, updateData) => {
        if (!id) {
            showError('ID информации не указан');
            return null;
        }

        if (!updateData || !updateData.about) {
            showError('Текст информации не может быть пустым');
            return null;
        }

        setLoading(true);
        setActionStatus('updating');

        const requestData = {
            about: updateData.about,
        };

        RequestFetch({
            url: `/api/v1/information/${id}`,
            method: 'PATCH',
            body: requestData,
            onSuccess: async (res) => {
                showSuccess('Информация успешно обновлена');
                setActionStatus('success');
                setLoading(false);
                return res?.data;
            },
            onError: (error) => {
                console.error('Update information error:', error);
                const errorMessage = error?.message || 'Не удалось обновить информацию';
                showError(errorMessage);
                setActionStatus('error');
                setLoading(false);
                return null;
            }
        });
    }, [showSuccess, showError]);

    return {
        loading,
        actionStatus,
        updateInformation,
    };
};