import {useCallback, useEffect, useState} from "react";

export function useImageLoading(totalImages = 0) {
    const [loadedImages, setLoadedImages] = useState(new Set());

    const handleLoad = useCallback( (id) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }, [])

    const isLoaded = useCallback((id) => loadedImages.has(id), [loadedImages]);

    const reset = useCallback(() => {
        setLoadedImages(new Set())
    }, [])

    const isAllLoaded = totalImages > 0 && loadedImages.size >= totalImages;

    useEffect(() => {
        if (totalImages === 0) {
            reset()
        }
    }, [totalImages, reset])

    return {
        handleLoad,
        isLoaded,
        isAllLoaded,
        totalLoaded: loadedImages.size,
        reset
    };
}