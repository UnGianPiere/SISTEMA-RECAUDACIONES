import React from "react";

export default function ReporteTabla({ datos }) {
    const { reporte, comprobantes } = datos;

    return (
        <div className="overflow-x-auto bg-white p-4 rounded shadow w-full max-w-5xl text-black">
            <h2 className="text-xl font-bold mb-4">Reporte #{reporte._id}</h2>
            <p>Fecha: {new Date(reporte.fecha).toLocaleDateString()}</p>
            <p>Total: S/. {reporte.total}</p>

            <table className="table-auto w-full mt-6 border-collapse">
                <thead>
                    <tr className="bg-green-200 text-left">
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Detalle</th>
                        <th className="border px-4 py-2">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {comprobantes.map((comp) =>
                        comp.detalles.map((det, i) => (
                            <tr key={`${comp._id}-${i}`} className="hover:bg-green-50">
                                <td className="border px-4 py-2">{comp.nombre}</td>
                                <td className="border px-4 py-2">{det.detalle || "Sin detalle"}</td>
                                <td className="border px-4 py-2">S/. {det.importe}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
