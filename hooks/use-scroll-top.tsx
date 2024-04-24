import { useState, useEffect } from "react";

export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handlesScroll = () => {
            if (window.scrollY > threshold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handlesScroll);
        return () => window.removeEventListener("scroll", handlesScroll);
    }, [threshold]);

    return scrolled
}