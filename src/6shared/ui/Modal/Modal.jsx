import React, {useEffect, useState} from 'react';

import "./modal.scss"


import CloseSvg from "@shared/imges/svg/closeSvg.svg?react"

const Modal = ({
    isOpen,
    onClose,
    modalType = "",
    children,
    showCloseButton = true,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                })
            })
        } else {
            setIsVisible(false)
            const timeout = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    },[isOpen])

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose()
        }, 300)
    }

    if (!shouldRender) return null;

    return (
        <div className={`modal-overlay ${isVisible ? 'modal-overlay--visible' : ''}`}>
            <div className={`${modalType} modal-content ${className} ${isVisible ? 'modal-content--visible' : ''}`}>
                {showCloseButton && (
                    <CloseSvg
                        width={0}
                        height={0}
                        className="modal-close"
                        onClick={handleClose}
                    />
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;