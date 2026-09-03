import React, {useEffect, useRef, useState} from 'react';
import './fullscreenGallery.scss'

import CloseSvg from "@shared/imges/svg/closeSvg.svg?react";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";

const FullscreenGallery = ({images, currentIndex = 0, onClose}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
    const thumbnailsRef = useRef(null);

    useEffect(() => {
        setCurrentImageIndex(currentIndex)
    }, [currentIndex]);

    const totalImages = images.length

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    }

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowRight') {
            handleNext()
        } else if (e.key === 'ArrowLeft') {
            handlePrev()
        }
    }

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    return (
        <div
            className={'fullscreen-gallery-backdrop'}
            onClick={handleBackdropClick}
        >
            <CloseSvg className="fullscreen-gallery-close" onClick={onClose} />
            <div className={'fullscreen-gallery-content '}>
                <div className={'fullscreen-gallery-navigation'}>
                    <ArrowBack className={'fullscreen-gallery-prev'} onClick={handlePrev} />
                    <img className={'fullscreen-gallery-image'} src={images[currentImageIndex]} />
                    <ArrowBack className={'fullscreen-gallery-next'} onClick={handleNext} />
                </div>

                <div className={'fullscreen-gallery-thumbnails'} ref={thumbnailsRef}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`fullscreen-gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img src={img} />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default FullscreenGallery;