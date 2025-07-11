"use client";
import { useEffect } from "react";

export default function GenericModal({ isOpen, onClose, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
        >
            <div
                className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()} // <--- Bloquea el cierre al hacer clic dentro
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}
