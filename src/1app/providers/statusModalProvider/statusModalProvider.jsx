import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import StatusModal from "@shared/ui/StatusModal/StatusModal";

const StatusModalContext = createContext();

export const useStatusModal = () => {
    const context = useContext(StatusModalContext);
    if (!context) {
        throw new Error("useStatusModal must be used within StatusModalProvider");
    }
    return context;
};

export const StatusModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: "",
        message: "",
        title: "",
        image: null,
        onCloseCallback: null,
        onConfirm: null,
        onCancel: null,
        confirmText: "Да",
        cancelText: "Нет",
        showConfirm: false,
        showCancel: false,
        showClose: true,
    });

    const queueRef = useRef([]);
    const isClosingRef = useRef(false);
    const isOpenRef = useRef(false);

    useEffect(() => {
        isOpenRef.current = modalState.isOpen;
    }, [modalState.isOpen]);

    const processQueue = useCallback(() => {
        if (isOpenRef.current || isClosingRef.current) return;
        if (queueRef.current.length === 0) return;

        const nextModal = queueRef.current.shift();
        setModalState(prev => ({ ...prev, ...nextModal, isOpen: false }));

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setModalState(prev => ({ ...prev, isOpen: true }));
            });
        });
    }, []);

    const enqueueModal = useCallback((options) => {
        const modalConfig = {
            type: options.type || "info",
            message: options.message || "",
            title: options.title || "",
            image: options.image || null,
            onCloseCallback: options.onClose || null,
            onConfirm: options.onConfirm || null,
            onCancel: options.onCancel || null,
            confirmText: options.confirmText || "Да",
            cancelText: options.cancelText || "Нет",
            showConfirm: options.showConfirm || false,
            showCancel: options.showCancel || false,
            showClose: options.showClose !== false,
        };

        queueRef.current.push(modalConfig);
        processQueue();
    }, [processQueue]);

    const closeStatusModal = useCallback(() => {
        if (!isOpenRef.current) return Promise.resolve();
        isClosingRef.current = true;

        setModalState(prev => ({ ...prev, isOpen: false }));

        return new Promise((resolve) => {
            setTimeout(() => {
                isClosingRef.current = false;
                setModalState({
                    isOpen: false,
                    type: "",
                    message: "",
                    title: "",
                    image: null,
                    onCloseCallback: null,
                    onConfirm: null,
                    onCancel: null,
                    confirmText: "Да",
                    cancelText: "Нет",
                    showConfirm: false,
                    showCancel: false,
                    showClose: true,
                });
                processQueue();
                resolve();
            }, 300);
        });
    }, [processQueue]);

    const showStatusModal = enqueueModal;

    const showSuccess = useCallback(
        (message = "Успешно!", title = "Успех", options = {}) => {
            enqueueModal({ type: "success", message, title, ...options });
        },
        [enqueueModal]
    );

    const showError = useCallback(
        (message = "Ошибка!", title = "Ошибка", options = {}) => {
            enqueueModal({ type: "error", message, title, ...options });
        },
        [enqueueModal]
    );

    const showConfirm = useCallback(
        (title, message, options = {}) => {
            enqueueModal({
                type: "info",
                title,
                message,
                showConfirm: true,
                showCancel: true,
                showClose: false,
                ...options,
            });
        },
        [enqueueModal]
    );

    const showInfo = useCallback(
        (message = "", title = 'Информация', options = {}) => {
            enqueueModal({type: "info", message, title, ...options})
        }, [enqueueModal]
    )

    const value = {
        showStatusModal,
        showSuccess,
        showError,
        showConfirm,
        showInfo,
        closeStatusModal,
    };

    return (
        <StatusModalContext.Provider value={value}>
            {children}
            <StatusModal {...modalState} onClose={closeStatusModal} />
        </StatusModalContext.Provider>
    );
};
