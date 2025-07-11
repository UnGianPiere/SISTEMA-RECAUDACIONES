"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ConfirmModal = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    ¿Confirmar cambios?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    ¿Estás seguro de que deseas guardar los cambios realizados?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded bg-gray-200 text-sm text-gray-800 hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                        Sí, guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

const TupaModal = ({ visible, onClose, urlTupa, onUpdate }) => {
    const [data, setData] = useState({
        _id: "",
        descripcion: "",
        medida: "",
        importe: "",
        espece: "",
    });



    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!urlTupa) return;

        const fetchData = async () => {
            try {
                const res = await fetch(urlTupa);
                const json = await res.json();
                setData(json);
            } catch (error) {
                toast.error("Error al cargar los datos");
            }
        };

        fetchData();
    }, [urlTupa]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const confirmSave = () => setShowConfirm(true);

    const urlUri=import.meta.env.VITE_API_URL;

    const handleSave = async () => {
        try {
            const res = await fetch(`${urlUri}/api/tupa/${data._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Error al guardar");

            if (onUpdate) onUpdate();
            toast.success("Cambios guardados correctamente");
            onClose();
        } catch (err) {
            toast.error("Error al guardar los cambios");
        } finally {
            setShowConfirm(false);
        }
    };

    if (!visible) return null;

    return (
        <>
            <Toaster position="bottom-right" />

            {/* Confirmación */}
            <ConfirmModal
                open={showConfirm}
                onConfirm={handleSave}
                onCancel={() => setShowConfirm(false)}
            />

            {/* Modal de edición */}
            <div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[85%] p-6 overflow-auto"
                >
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Editar TUPA</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                        >
                            ✖
                        </button>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            confirmSave();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código</label>
                            <input
                                type="text"
                                value={data._id}
                                readOnly
                                className="w-full border px-3 py-1.5 rounded bg-gray-100 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={data.descripcion}
                                onChange={handleChange}
                                className="w-full border px-3 py-1.5 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Medida</label>
                            <input
                                type="text"
                                name="medida"
                                value={data.medida}
                                onChange={handleChange}
                                className="w-full border px-3 py-1.5 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Importe</label>
                            <input
                                type="text"
                                name="importe"
                                value={data.importe}
                                onChange={handleChange}
                                className="w-full border px-3 py-1.5 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Espece</label>
                            <input
                                type="text"
                                name="espece"
                                value={data.espece}
                                onChange={handleChange}
                                className="w-full border px-3 py-1.5 rounded text-sm"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TupaModal;
