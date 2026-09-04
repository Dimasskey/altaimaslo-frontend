import React, {useEffect} from 'react';
import "./mobileSideDrawer.scss"

const MobileSideDrawer = ({isOpen, onClose, side = 'left', children}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    return (
        <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
            <div className={`mobile-drawer-content ${side}`}>
                {children}
            </div>
            <div className={'mobile-drawer-overlay'} onClick={onClose}></div>
        </div>
    );
};

export default MobileSideDrawer;