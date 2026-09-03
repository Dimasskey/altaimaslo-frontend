import {useEffect, useRef} from "react";

export function useInfinityScroll(callback) {
    const sentinelRef = useRef(null)

    useEffect(() => {
        if (!sentinelRef.current) return

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) callback();
        })

        observer.observe(sentinelRef.current)

        return () => observer.disconnect()
    }, [callback]);

    return {sentinelRef}
}