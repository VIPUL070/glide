import { Variants } from "motion";

export const containerVariants: Variants = {
    visibleFull: {
        y: 0,
        opacity: 1,
        width: "100%",
        maxWidth: "100%",
        top: 0,
        borderRadius: "0px",
        borderBottomWidth: "0.5px",
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        paddingLeft: "0px",
        paddingRight: "0px",
        transition: {
            duration: 0.3,
            delay: 0.15,
        },
    },
    visibleFloating: {
        y: 0,
        opacity: 1,
        width: "100%",
        maxWidth: "100%",
        borderRadius: "0px",
        borderBottomWidth: "0.5px",
        borderColor: "rgba(255, 255, 255, 0.15)",
        backgroundColor: "var(--bg-primary, #000000)",
        color: "var(--text-secondary, #f9fafb)",
        paddingLeft: "0px",
        paddingRight: "0px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
        transition: {
            type: "spring" as const,
            stiffness: 220,
            damping: 24,
        },
    },
    hidden: {
        y: -100,
        opacity: 0,
        transition: {
            type: "tween",
            ease: "easeInOut",
            duration: 0.25
        },
    },
};

export const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 12 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            damping: 26,
            stiffness: 320,
            mass: 0.8,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 8,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

export const heroContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.08,
        },
    },
};

export const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 25 }
    },
};