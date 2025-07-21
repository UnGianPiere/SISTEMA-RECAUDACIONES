"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalGuardar = ({ visible, onClose, data, save}) => {
    if (!visible) return null;

    const [pdfUrl, setPdfUrl] = useState(null);
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const generarPDF = async () => {
            try {
                const response = await axios.post(
                    `${API}/api/pdf/generar-pdf-comprobante-caja`,
                    data,
                    { responseType: "blob" } // ✅ importante
                );

                const file = new Blob([response.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                setPdfUrl(fileURL);
            } catch (error) {
                console.error("Error al generar el PDF:", error);
            }
        };

        generarPDF();
    }, [data]);

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
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <p className="text-center mt-10">Cargando PDF...</p>
                    )}
                </div>

                {/* Botón inferior */}
                <button 
                onClick={save}
                className="w-full mt-4 p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl font-bold text-white hover:brightness-90 flex justify-center gap-3 items-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    Guardar
                </button>
            </div>
        </div>

    );
};

export default ModalGuardar;
