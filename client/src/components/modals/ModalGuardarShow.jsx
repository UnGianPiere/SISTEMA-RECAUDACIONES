"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalGuardar = ({ visible, onClose, data}) => {
    if (!visible) return null;

    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const generarPDF = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    `${API}/api/pdf/generar-pdf-comprobante-show/`,
                    data,
                    { responseType: "blob" } // ✅ importante
                );

                const file = new Blob([response.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                setPdfUrl(fileURL);
            } catch (error) {
                console.error("Error al generar el PDF:", error);
            } finally {
                setIsLoading(false);
            }
        };

        generarPDF();
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await save();
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (

        <div className="w-full absolute z-10 inset-0 flex items-center justify-center bg-black/10">
            <div className="w-200 max-w-4xl h-150 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-4xl flex flex-col p-5 relative shadow-xl">

                {/* Botón de cierre en la esquina superior derecha */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center z-20"
                >
                    X
                </button>

                {/* Contenedor del iframe */}
                <div className="w-full h-full p-4 rounded-xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <p className="ml-3">Generando PDF...</p>
                        </div>
                    ) : pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <p className="text-center mt-10">Error al cargar el PDF</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ModalGuardar;
