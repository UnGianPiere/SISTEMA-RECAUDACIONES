"use client"

import { useState, useEffect } from "react"
import Modal from "../components/modals/TupaModal"

export default function TablasSection() {
  const [activeTable, setActiveTable] = useState("tupa")
  const [dataTupa, setDataTupa] = useState([])
  const [modal, setModal] = useState(false)
  const [urlTupa, setUrlTupa] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const API = import.meta.env.VITE_API_URL

  const mostrarModal = (id) => {
    setModal(true)
    setUrlTupa(`${API}/api/tupa/${id}`)
  }

  const fetchTupaData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API}/api/tupa`)
      if (!response.ok) throw new Error("Error al obtener los datos del TUPA")
      const data = await response.json()
      console.log("✅ TUPA data loaded:", data)
      setDataTupa(data)
    } catch (error) {
      console.error("❌ Error fetching TUPA data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTupaData()
  }, [])

  const tables = [
    {
      id: "tupa",
      label: "TUPA",
      description: "Texto Único de Procedimientos Administrativos",
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
      color: "from-blue-500 to-blue-600",
    },
  ]

  // Filtrar datos según el término de búsqueda
  const filteredData = dataTupa.filter(
    (item) =>
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || item._id.toString().includes(searchTerm),
  )

  const renderTable = () => {
    if (activeTable !== "tupa") return null

    return (
      <div className="space-y-3">
        {/* Barra de búsqueda compacta */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
            />
          </div>
          <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
            {filteredData.length} de {dataTupa.length} registros
          </div>
        </div>

        {/* Tabla compacta */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="spinner border-blue-600"></div>
                    <span className="text-gray-600 text-xs">Cargando datos...</span>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gradient-to-r from-slate-100 to-gray-100 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">
                        Medida
                      </th>
                      <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">
                        Importe
                      </th>
                      <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">
                        Especie
                      </th>
                      <th className="px-2 py-2 text-center font-bold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-gray-500 text-xs">No se encontraron registros</p>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                Limpiar búsqueda
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150 group">
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-md flex items-center justify-center mr-2">
                                <span className="text-xs font-bold text-blue-800">{item._id}</span>
                              </div>
                              <span className="text-xs font-medium text-gray-900">{item._id}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <div className="text-xs text-gray-900 font-medium line-clamp-2">{item.descripcion}</div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.medida}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="text-xs font-bold text-green-600">S/ {item.importe}</span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.espece}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-1 mx-auto"
                              onClick={() => mostrarModal(item._id)}
                            >
                              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              <span>Editar</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <Modal
          visible={modal}
          onClose={() => {
            setModal(false)
            setUrlTupa("")
          }}
          urlTupa={urlTupa}
          onUpdate={() => {
            fetchTupaData()
            setModal(false)
            setUrlTupa("")
          }}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-2 p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col min-h-0 border border-gray-200">
        {/* Header compacto con tabs */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Tablas del Sistema</h2>
              <p className="text-xs text-gray-600">Gestione las tablas maestras del sistema</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <span>Base de datos activa</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => setActiveTable(table.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTable === table.id
                    ? `bg-gradient-to-r ${table.color} text-white shadow-md transform scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>{table.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{table.label}</div>
                  <div className="text-xs opacity-90">{table.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Controles compactos */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{tables.find((t) => t.id === activeTable)?.label}</span>
            </h3>
            <div className="flex flex-wrap gap-1">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nuevo</span>
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla con scroll compacta */}
        <div className="flex-1 p-3 sm:p-4 overflow-auto">{renderTable()}</div>
      </div>
    </div>
  )
}
