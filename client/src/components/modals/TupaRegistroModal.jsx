import React from "react";
import { useState, useEffect } from "react";

export const TupaRegistroModal = ({ visible, onClose }) => {
if (!visible) return null;
    const [dataTupa, setDataTupa] = useState([])
    const API=import.meta.env.VITE_API_URL;
    useEffect(() => {

        const fetchData = async () => {
            const data = await fetch(`${API}/api/tupa`)
            const json = await data.json()
            console.log(json)
            setDataTupa(json)
        }

        fetchData()

    }, [])


    return (
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-200 h-150 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Tupa Registro</h2>

                <div className="relative overflow-x-auto max-h-110 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th>Codigo</th>
                                <th>Descripción</th>
                                <th>U. Medida</th>
                                <th>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataTupa.map((item, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <th scope="row" class="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item._id}
                                        </th>
                                        <td>{item.descripcion}</td>
                                        <td>{item.medida}</td>
                                        <td>{item.importe}</td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
