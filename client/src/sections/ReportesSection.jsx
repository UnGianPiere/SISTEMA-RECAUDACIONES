"use client"

import { useState } from "react"
import Modal from "../components/modals/PDFModal"

function ReportesSection() {
  const API = import.meta.env.VITE_API_URL

  const [modalVisible, setModalVisible] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  // Obtener fecha actual
  const fechaActual = new Date()
  const mesActual = (fechaActual.getMonth() + 1).toString() // getMonth() devuelve 0-11
  const añoActual = fechaActual.getFullYear().toString()

  const [filtros, setFiltros] = useState({
    año: añoActual,
    mes: mesActual,
  })

  const abrirModalConPDF = (tipoReporte) => {
    const url = `${API}/api/pdf/generar-pdf-mensual-${tipoReporte}/${filtros.año}/${filtros.mes}`
    setPdfUrl(url)
    setModalVisible(true)
  }

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    })
  }

  const añosDisponibles = () => {
    const añoInicio = 2021;
    const años = [];
    for (let año = añoActual; año >= añoInicio; año--) {
      años.push(año);
    }
    return años;
  }
  const añosRecientes = añosDisponibles()

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  const getFechaActual = () => `${meses.find((m) => m.value === filtros.mes)?.label} ${filtros.año}`

  const reportes = [
    {
      id: 1,
      titulo: "INFORMACIÓN DE INGRESOS POR FUENTE DE FINANCIAMIENTO Y MONEDA",
      descripcion: "Reporte detallado de ingresos clasificados por fuente de financiamiento",
      fecha: getFechaActual(),
      tipo: "PDF",
      tipoAPI: "ingresos",
      color: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      titulo: "RESUMEN DE RECAUDACIÓN DE INGRESOS DE ACUERDO AL T-5",
      descripcion: "Resumen mensual de recaudación según formato T-5",
      fecha: getFechaActual(),
      tipo: "PDF",
      tipoAPI: "recaudacion",
      color: "from-green-500 to-green-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: 3,
      titulo: "HOJA DE TRABAJO",
      descripcion: "Hoja de trabajo con cálculos y análisis mensual",
      fecha: getFechaActual(),
      tipo: "PDF",
      tipoAPI: "hoja-trabajo",
      color: "from-purple-500 to-purple-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      titulo: "DOCUMENTOS ANULADOS",
      descripcion: "Listado de documentos anulados en el período",
      fecha: getFechaActual(),
      tipo: "PDF",
      tipoAPI: "doc-anulado",
      color: "from-red-500 to-red-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
    {
      id: 5,
      titulo: "DOCUMENTOS EMITIDOS",
      descripcion: "Registro completo de documentos emitidos",
      fecha: getFechaActual(),
      tipo: "PDF",
      tipoAPI: "doc-emitido",
      color: "from-indigo-500 to-indigo-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ]

  const handleDescargar = async (tipoAPI) => {
    try {
      const url = `${API}/api/pdf/generar-pdf-mensual-${tipoAPI}/${filtros.año}/${filtros.mes}`
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `reporte-${tipoAPI}-${filtros.año}-${filtros.mes}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      showToast("✅ Descarga completada")
    } catch (error) {
      console.error("❌ Error al descargar PDF:", error)
      showToast("❌ Error al descargar PDF")
    }
  }

  const handleImprimir = async (tipoAPI) => {
    setLoading(true)
    try {
      const url = `${API}/api/pdf/generar-pdf-mensual-${tipoAPI}/${filtros.año}/${filtros.mes}`
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.src = blobUrl
      document.body.appendChild(iframe)
      iframe.onload = () => {
        setLoading(false)
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        showToast("🖨️ Imprimiendo...")
      }
    } catch (error) {
      console.error("❌ Error al imprimir PDF:", error)
      showToast("❌ Error al imprimir PDF")
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="h-full flex flex-col space-y-2 p-1 sm:p-2">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 border border-slate-600 animate-fadeIn">
          {toast}
        </div>
      )}



      {loading && (

        <div className="fixed  inset-0 h-full w-full z-100 flex justify-center items-center bg-black/10 flex-col gap-4">
          <div className="flex justify-center items-center ">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 class="text-2xl text-blue-500 font-bold hover:[--tw-animate-bounce-text_restart:restart]">
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">C</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">a</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">r</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">g</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">a</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">n</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">d</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">o</span>
          </h1>
        </div>

      )}


      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} pdfUrl={pdfUrl} />

      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col min-h-0 border border-gray-200">
        {/* Header compacto */}
        <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Reportes Mensuales</h2>
              <p className="text-xs text-gray-600">Genere y visualice reportes del sistema</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Período: {meses.find((m) => m.value === filtros.mes)?.label} {filtros.año}
              </span>
            </div>
          </div>
        </div>

        {/* Filtros compactos */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="grid grid-cols-2 gap-3 flex-1 max-w-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Año</label>
                <select
                  name="año"
                  value={filtros.año}
                  onChange={handleFiltroChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  {añosRecientes.map((año) => (
                    <option key={año} value={año}>
                      {año}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mes</label>
                <select
                  name="mes"
                  value={filtros.mes}
                  onChange={handleFiltroChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  {meses.map((mes) => (
                    <option key={mes.value} value={mes.value}>
                      {mes.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              <span className="font-medium">Tip:</span> Seleccione el período
            </div>
          </div>
        </div>

        {/* Reportes compactos */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="grid gap-2 sm:gap-3">
            {reportes.map((reporte) => (
              <div
                key={reporte.id}
                className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${reporte.color} rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
                    >
                      {reporte.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {reporte.titulo}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{reporte.descripcion}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center space-x-1 bg-gray-100 px-2 py-0.5 rounded-md">
                          <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{reporte.fecha}</span>
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium border border-red-200">
                          {reporte.tipo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 lg:flex-nowrap lg:ml-3">
                    <button
                      onClick={() => abrirModalConPDF(reporte.tipoAPI)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>Ver</span>
                    </button>

                    <button
                      onClick={() => handleDescargar(reporte.tipoAPI)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Descargar</span>
                    </button>

                    <button
                      onClick={() => handleImprimir(reporte.tipoAPI)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-1 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                      title="Imprimir"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesSection
