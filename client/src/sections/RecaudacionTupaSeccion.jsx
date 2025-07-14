"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { TupaRegistroModal } from "../components/modals/TupaRegistroModal"
import { RegistroModal } from "../components/modals/RegistroModal"
import axios from "axios"

function TupaSeccion() {
  const navigate = useNavigate()
  const location = useLocation()
  const hoy = new Date()
  const fechaPeru = hoy.toLocaleDateString("es-PE")
  const [mostrarTupa, setMostrarTupa] = useState(false)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [rows, setRows] = useState([])
  const [tablaData, setTablaData] = useState([])
  const [detalles, setDetalle] = useState("")

  const API = import.meta.env.VITE_API_URL

  const handleGuardarImprimir = async () => {
    const Comprobante = generarComprobanteIngreso()
    const detalles = generarDetalles()
    const idComprobante = Comprobante.numeroregistro
    const monto = detalles.reduce((total, item) => {
      return total + item.importe * item.cantidad
    }, 0)
    console.log(monto)
    try {
      await axios.post(`${API}/api/comprobantes/crear`, {
        comprobante: Comprobante,
        detalles: detalles,
      })
      await axios.put(`${API}/api/reporte-diario/suma/${idComprobante}`, {
        monto,
      })
      navigate("/recaudacion")
    } catch (error) {
      console.error(`el error fue ${error}`)
    }
  }

  const generarComprobanteIngreso = () => {
    const data = datosRegistro
    const isRuc = data.tipoDocumento === "ruc"
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
      detalle: detalles,
    }
  }

  const generarDetalles = () => {
    const data = tablaData
    return data.map((item) => ({
      ingresoId: datosRegistro.ultimoreg,
      tupaId: item._id,
      cantidad: item.cantidad,
      importe: item.importe,
      igv: 0,
    }))
  }

  const [total, setTotal] = useState(0)
  const emptyRowCount = Math.max(0, 8 - rows.length)
  const emptyRows = Array(emptyRowCount).fill({
    codigo: "",
    cantidad: "",
    descripcion: "",
    detalle: "",
    unitario: "",
    venta: "",
  })

  const manejarNuevoRegistro = (registro) => {
    const nuevaFila = {
      codigo: registro._id,
      cantidad: registro.cantidad,
      descripcion: registro.descripcion,
      detalle: "",
      unitario: registro.importe,
      venta: registro.total,
    }
    setRows((prev) => [nuevaFila, ...prev])
    setTablaData((prevTabla) => {
      const nuevaTabla = [...prevTabla, registro]
      const nuevoTotal = nuevaTabla.reduce((acc, item) => acc + item.total, 0)
      setTotal(nuevoTotal)
      setTablaData(nuevaTabla)
      return nuevaTabla
    })
    setMostrarRegistro(false)
  }

  useEffect(() => {
    console.log("🧾 Total actualizado:", total)
  }, [total])

  // Intenta obtener datosRegistro del state, si no existe, usa localStorage
  let datosRegistro = location.state?.datosRegistro
  if (!datosRegistro) {
    try {
      datosRegistro = JSON.parse(localStorage.getItem("datosRegistro")) || null
    } catch {
      datosRegistro = null
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
    <div className="max-h-full">
      <TupaRegistroModal visible={mostrarTupa} onClose={() => setMostrarTupa(false)} />
      <RegistroModal
        visible={mostrarRegistro}
        onClose={() => setMostrarRegistro(false)}
        onRegistro={manejarNuevoRegistro}
      />

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header compacto */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
            <img
              src="/icon/Escudo.png"
              className="w-8 h-8 sm:w-12 sm:h-12 transition-transform hover:scale-105"
              alt="Escudo"
            />
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gray-800">Gobierno Regional de Junín</h1>
              <p className="text-xs text-gray-600">Sistema de Recaudaciones</p>
            </div>
          </div>
          <div className="text-center">
            <span className="text-red-600 font-bold text-sm sm:text-base block mb-1">Comprobante de pago</span>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-lg px-3 py-1 shadow-sm">
              <span className="text-blue-800 font-bold text-base sm:text-lg">#{datosRegistro?.ultimoreg || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Formulario compacto */}
        <section className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            <div className="space-y-1">
              <label htmlFor="nombre" className="text-xs font-semibold text-gray-700 block">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                readOnly
                value={datosRegistro?.nombre || ""}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ruc" className="text-xs font-semibold text-gray-700 block">
                R.U.C
              </label>
              <input
                id="ruc"
                type="text"
                readOnly
                value={datosRegistro?.tipoDocumento === "ruc" ? datosRegistro.numeroDocumento : ""}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="direccion" className="text-xs font-semibold text-gray-700 block">
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                readOnly
                value={datosRegistro?.direccion || ""}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="fecha" className="text-xs font-semibold text-gray-700 block">
                Fecha
              </label>
              <input
                id="fecha"
                type="text"
                readOnly
                value={fechaPeru}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="dni" className="text-xs font-semibold text-gray-700 block">
                D.N.I
              </label>
              <input
                id="dni"
                type="text"
                readOnly
                value={datosRegistro?.tipoDocumento === "dni" ? datosRegistro.numeroDocumento : ""}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium text-gray-800"
              />
            </div>
          </div>
        </section>

        {/* Tabla compacta */}
        <section className="p-3 sm:p-4">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-800">Detalle de Servicios</h3>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <div className="max-h-48 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-xs">
                <thead className="bg-gradient-to-r from-slate-100 to-gray-100 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider">Código</th>
                    <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">Cant.</th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider">Detalle</th>
                    <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">P. Unit.</th>
                    <th className="px-2 py-2 text-right font-bold text-gray-700 uppercase tracking-wider">V. Venta</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...rows, ...emptyRows].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900">{row.codigo}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-gray-700 text-center">{row.cantidad}</td>
                      <td className="px-2 py-2 text-gray-700">{row.descripcion}</td>
                      <td className="px-2 py-1 text-gray-700">{row.detalle}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-700 text-center">{row.unitario}</td>
                      <td className="px-2 py-1 whitespace-nowrap font-medium text-gray-900 text-right">{row.venta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer compacto */}
        <section className="p-3 sm:p-2 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Botones de acción */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleRegistro}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar</span>
                </button>

                <button
                  onClick={handleTupa}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>TUPA</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Detalle</label>
                <input
                  type="text"
                  value={detalles}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Ingrese detalles adicionales..."
                  className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Panel de totales compacto */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <h4 className="text-sm font-bold text-center">Resumen</h4>

              <div className="">
                <div className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span className="text-xs font-medium ">Valor de Venta</span>
                  <span className="text-xs font-bold ">S/ {total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600">I.G.V. (18%)</span>
                  <span className="text-xs font-bold text-gray-800">S/ 0.00</span>
                </div>

                <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-md px-2 border border-green-200">
                  <span className="text-sm font-bold text-green-800">Total</span>
                  <span className="text-sm font-bold text-green-800">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleGuardarImprimir}
                className="w-full  bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Guardar e Imprimir</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TupaSeccion
