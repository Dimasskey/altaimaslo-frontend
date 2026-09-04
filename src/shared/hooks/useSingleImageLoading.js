import {useImageLoading} from "@shared/hooks/useImageLoading";
import {useEffect} from "react";

export function useSingleImageLoading(src) {
    const {handleLoad, isLoaded, reset} = useImageLoading(1)

    useEffect(() => {
        if (!src) {
            reset()
            return;
        }

        reset();

        const img = new Image()
        img.src = src;

        if (img.complete && img.naturalHeight !== 0) {
            handleLoad('single')
            return;
        }

        img.onload = () => {
            handleLoad('single')
        }

        return () => {
            img.onload = null
        }
    }, [src, handleLoad, reset]);

    return isLoaded('single')
}