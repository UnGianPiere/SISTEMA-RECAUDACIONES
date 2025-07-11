"use client";
import React from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message = "¿Estás seguro?" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div
                className="bg-white rounded-md p-5 w-[300px] shadow-md relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-sm text-gray-700 mb-4">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1 text-sm rounded bg-black/80 text-white hover:bg-black"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
