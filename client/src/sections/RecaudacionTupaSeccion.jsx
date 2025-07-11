"use client";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { TupaRegistroModal } from '../components/modals/TupaRegistroModal'
import { RegistroModal } from '../components/modals/RegistroModal'
import axios from "axios";

function TupaSeccion() {
    const navigate = useNavigate();

    const location = useLocation();
    const hoy = new Date();
    const fechaPeru = hoy.toLocaleDateString("es-PE");
    const [mostrarTupa, setMostrarTupa] = useState(false)
    const [mostrarRegistro, setMostrarRegistro] = useState(false)
    const [rows, setRows] = useState([]);
    const [tablaData, setTablaData] = useState([]);
    const [detalles, setDetalle] = useState("")
    const API =import.meta.env.VITE_API_URL;
    const handleGuardarImprimir = async () => {
        const Comprobante = generarComprobanteIngreso()
        const detalles = generarDetalles()
        const idComprobante = Comprobante.numeroregistro
        const monto = detalles.reduce((total, item) => {
            return total + item.importe * item.cantidad;
        }, 0)
        console.log(monto)
        try {
            await axios.post(`${API}/api/comprobantes/crear`, {
                comprobante: Comprobante,
                detalles: detalles
            })
            await axios.put(`${API}/api/reporte-diario/suma/${idComprobante}`, {
                monto
            })
            navigate("/recaudacion")
        } catch (error) {
            console.error(`el error fue ${error}`)
        }
    }

    const generarComprobanteIngreso = () => {
        const data = datosRegistro
        const isRuc = data.tipoDocumento === "ruc";
        return {
            _id: data.ultimoreg,
            numeroregistro: data.numeroRecibo,
            serie: 4,
            nombre: data.nombre,
            direccion: data.direccion,
            ruc: isRuc ? data.numeroDocumento : "",
            dni: !isRuc ? data.numeroDocumento : "",
            numcelular: "",
            anulado: false,
            grav: "N",
            igv: 0,
            detalle: detalles
        };
    };

    const generarDetalles = () => {
        const data = tablaData
        return data.map(item => ({
            ingresoId: datosRegistro.ultimoreg,
            tupaId: item._id,
            cantidad: item.cantidad,
            importe: item.importe,
            igv: 0,
        }));
    };



    const [total, setTotal] = useState(0)
    const emptyRowCount = Math.max(0, 8 - rows.length);
    const emptyRows = Array(emptyRowCount).fill({
        codigo: '',
        cantidad: '',
        descripcion: '',
        detalle: '',
        unitario: '',
        venta: ''
    });


    const manejarNuevoRegistro = (registro) => {
        const nuevaFila = {
            codigo: registro._id,
            cantidad: registro.cantidad,
            descripcion: registro.descripcion,
            detalle: '',
            unitario: registro.importe,
            venta: registro.total,
        };
        setRows((prev) => [nuevaFila, ...prev]);
        setTablaData((prevTabla) => {
            const nuevaTabla = [...prevTabla, registro];
            const nuevoTotal = nuevaTabla.reduce((acc, item) => acc + item.total, 0);
            setTotal(nuevoTotal);
            setTablaData(nuevaTabla)
            return nuevaTabla;
        });
        setMostrarRegistro(false);
    };

    useEffect(() => {
        console.log("🧾 Total actualizado:", total);
    }, [total]);

    // Intenta obtener datosRegistro del state, si no existe, usa localStorage
    let datosRegistro = location.state?.datosRegistro;
    if (!datosRegistro) {
        try {
            datosRegistro = JSON.parse(localStorage.getItem('datosRegistro')) || null;
        } catch {
            datosRegistro = null;
        }
    }
    useEffect(() => {
        console.log("📦 Datos recibidos en TupaSeccion:", datosRegistro)
    }, [datosRegistro])

    const handleTupa = () => {
        setMostrarTupa(true)
    }

    const handleRegistro = () => {
        setMostrarRegistro(true)
    }

    return (
        <div className="px-10 py-0">

            <TupaRegistroModal
                visible={mostrarTupa}
                onClose={() => setMostrarTupa(false)}
            />

            <RegistroModal
                visible={mostrarRegistro}
                onClose={() => setMostrarRegistro(false)}
                onRegistro={manejarNuevoRegistro}
            />


            <div className="flex justify-between px-10">
                <div>
                    <img src="/icon/Escudo.png" className="w-12" />
                </div>
                <div className="flex flex-col text-center">
                    <span className="text-red-500 font-bold">Comprobante de pago</span>
                    <span className="bg-white inset-shadow-sm inset-shadow-blue-200">{datosRegistro.ultimoreg
                    }</span>
                </div>
            </div>

            <section className="border-gray-300 border-1 rounded-sm">
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 p-3 max-w-3xl w-full">

                        <div className="flex flex-col w-90 mx-auto">
                            <label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                readOnly
                                value={datosRegistro.nombre}
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-[250px] mx-auto">
                            <label htmlFor="ruc" className="text-sm font-medium text-gray-700 mb-1">R.U.C</label>
                            <input
                                id="ruc"
                                type="text"
                                readOnly
                                value={
                                    datosRegistro.tipoDocumento === "ruc"
                                        ? datosRegistro.numeroDocumento
                                        : ""
                                }
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-90 mx-auto">
                            <label htmlFor="direccion" className="text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                                id="direccion"
                                type="text"
                                readOnly
                                value={datosRegistro.direccion}
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-[250px] mx-auto">
                            <label htmlFor="fecha" className="text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                id="fecha"
                                type="text"
                                readOnly
                                value={fechaPeru}
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-full"
                            />
                        </div>

                        <div className="flex flex-col w-90 mx-auto col-start-1">
                            <label htmlFor="dni" className="text-sm font-medium text-gray-700 mb-1">D.N.I</label>
                            <input
                                id="dni"
                                type="text"
                                readOnly
                                value={
                                    datosRegistro.tipoDocumento === "dni"
                                        ? datosRegistro.numeroDocumento
                                        : ""
                                }
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-50"
                            />
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div className="relative overflow-x-auto mt-3 max-h-65 overflow-y-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">Código</th>
                                <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
                                <th scope="col" className="px-6 py-3 text-center">Descripción</th>
                                <th scope="col" className="px-6 py-3 text-center">Detalle</th>
                                <th scope="col" className="px-6 py-3 text-center">Pre. Unitario</th>
                                <th scope="col" className="px-6 py-3 text-center">V. Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...rows, ...emptyRows].map((row, i) => (
                                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="text-center px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {row.codigo}
                                    </td>
                                    <td className="px-6 h-6 text-center">{row.cantidad}</td>
                                    <td className="px-6">{row.descripcion}</td>
                                    <td className="px-6">{row.detalle}</td>
                                    <td className="px-6 text-center">{row.unitario}</td>
                                    <td className="px-1 text-right">{row.venta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-2">
                <div className="flex w-full">
                    {/* Lado izquierdo: 75% */}
                    <div className="w-4/5 flex flex-col gap-4 pr-4">
                        {/* Fila 1: botones */}
                        <div className="flex gap-5">
                            <button
                                onClick={handleRegistro}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-800">
                                + Agregar Registro
                            </button>
                            <button
                                onClick={handleTupa}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-800">
                                Ver Tupa
                            </button>

                        </div>

                        {/* Fila 2: detalle */}
                        <div className="pt-1 flex flex-col">
                            <span>Detalle</span>
                            <input
                                type="text"
                                value={detalles}
                                onChange={(e) => setDetalle(e.target.value)}
                                className="bg-blue-200/10 rounded-md border-t border-l border-blue-400 px-3 py-0.5 w-3/4"
                            />
                        </div>
                    </div>

                    {/* Lado derecho: 25% */}
                    <div className="w-1/5 flex flex-col gap-2 text-[14px] p-0">
                        <div className="w-full  flex flex-col gap-2 p-0">
                            <div className="flex">
                                <p className="w-1/2">Valor de Venta</p>
                                <input type="text" value={`S/. ${total}`} className="text-right w-1/2 px-1" />
                            </div>

                            <div className="flex">
                                <p className="w-1/2">I.G.V. (18%)</p>
                                <input type="text" value="S/. 0" className="w-1/2 text-right px-1" />
                            </div>

                            <div className="flex">
                                <p className="w-1/2">Total</p>
                                <input type="text" value={`S/. ${total}`} className="w-1/2  text-right px-1" />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleGuardarImprimir}
                                className="px-5 py-2 text-sm font-medium text-white bg-green-700/90 rounded-lg hover:bg-green-800">
                                Guardar e Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}

export default TupaSeccion;
