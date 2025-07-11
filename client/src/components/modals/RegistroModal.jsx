import React from "react";
import { useState, useEffect } from "react";

export const RegistroModal = ({ visible, onClose, onRegistro }) => {
    if (!visible) return null;

    const urlUri=import.meta.env.VITE_API_URL||"http://localhost:5000"
    const [dataTupa, setDataTupa] = useState({})
    const [cantidad, setCantidad] = useState()

    const fetchData = async (e) => {
        const id = e.target.value;
        try {
            const data = await fetch(`${urlUri}/api/tupa/${id}`)
            const json = await data.json()
            console.log(json);
            setDataTupa(json)

        } catch (error) {
            console.error(`Ocurrio un error: ${error}`)
        }
    }

    const handleRegistro = (e) => {
        e.preventDefault();

        if (!dataTupa || !dataTupa.importe || isNaN(cantidad)) {
            alert("Datos incompletos o inválidos.");
            return;
        }
        const registro = {
            ...dataTupa,
            cantidad: parseInt(cantidad),
            total: parseFloat(dataTupa.importe) * parseInt(cantidad)
        };

        onRegistro(registro);
    };

    return (
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-120 h-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Adiciona Registro</h2>

                <form
                    onSubmit={handleRegistro}
                    className="flex flex-col gap-3 px-6 bg-white  w-full max-w-md">
                    <div className="flex items-center justify-between">
                        <label className="w-1/3 text-gray-700">Código :</label>
                        <input
                            type="number"
                            onChange={fetchData}
                            required
                            className="w-2/3 bg-gray-100 text-gray-800 rounded border border-gray-300 px-2  focus:ring focus:ring-blue-200 text-center"
                        />
                    </div>

                    <div className="bg-gray-50 py-1 text-center text-gray-600 rounded">
                        <span>{dataTupa.descripcion}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/3 text-gray-700">P.Unitario :</label>
                        <input
                            type="text"
                            value={dataTupa.importe}
                            readOnly
                            className="w-2/3 bg-gray-100 text-gray-800 rounded border border-gray-300 px-2 focus:ring focus:ring-blue-200 text-center"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="w-1/3 text-gray-700">Cantidad :</label>
                        <input
                            type="number"
                            required
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            className="w-2/3 bg-gray-100 text-gray-800 rounded border border-gray-300 px-2 focus:ring focus:ring-blue-200 text-center"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-1">
                        <button
                            type="submit"
                            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Agregar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
};
