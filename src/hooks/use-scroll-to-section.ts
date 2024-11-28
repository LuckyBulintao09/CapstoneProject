import { useCallback } from "react";

const useScrollToSection = () => {
    const scrollToSection = useCallback((sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return scrollToSection;
};

export default useScrollToSection;
