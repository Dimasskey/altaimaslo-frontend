import {useEffect, useRef, useState} from "react";

export function useScrollShadow(categories) {
    const ref = useRef(null)
    const [hasShadow, setHasShadow] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        function updateShadow() {
            const isScrollable = el.scrollHeight > el.clientHeight;

            setHasShadow(isScrollable)
        }

        updateShadow()

        el.addEventListener('scroll', updateShadow)
        window.addEventListener('resize', updateShadow)

        return () => {
            el.removeEventListener('scroll', updateShadow)
            window.removeEventListener('scroll', updateShadow)
        }
    }, [categories]);

    return {ref, hasShadow}
}