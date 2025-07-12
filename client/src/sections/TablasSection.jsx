"use client"

import { useState, useEffect } from "react"
import Modal from "../components/modals/TupaModal"

export default function TablasSection() {
  const [activeTable, setActiveTable] = useState("tupa")
  const [dataTupa, setDataTupa] = useState([])
  const [modal, setModal] = useState(false)
  const [urlTupa, setUrlTupa] = useState("")

  const API =import.meta.env.VITE_API_URL;

  const mostrarModal = (id) => {
    
    setModal(true)
    setUrlTupa(`${API}/api/tupa/${id}`)

  }
  


  const fetchTupaData = async () => {
    try {
      const response = await fetch(`${API}/api/tupa`)
      if (!response.ok) throw new Error("Error al obtener los datos del TUPA")
      const data = await response.json()
      console.log("✅ TUPA data loaded:", data)
      setDataTupa(data)
    } catch (error) {
      console.error("❌ Error fetching TUPA data:", error)
    }
  }


  useEffect(() => {
    fetchTupaData()
  }, [])

  const tables = [
    {
      id: "tupa",
      label: "TUPA",
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

  const renderTable = () => {
    if (activeTable !== "tupa") return null

    return (



      <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">

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


        <table className="min-w-full text-xs text-gray-700 bg-white tabla-gobierno">
          <thead className="bg-blue-50 sticky top-0">
            <tr>
              <th className="px-2 py-2 border-b text-center font-medium">Código</th>
              <th className="px-2 py-2 border-b text-center font-medium">Descripción</th>
              <th className="px-2 py-2 border-b text-center font-medium">Medida</th>
              <th className="px-2 py-2 border-b text-center font-medium">Importe</th>
              <th className="px-2 py-2 border-b text-center font-medium">Espece</th>
              <th className="px-2 py-2 border-b text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataTupa.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 text-center">
                <td className="px-2 py-2 border-b">{item._id}</td>
                <td className="px-2 py-2 border-b text-left w-[30%]">{item.descripcion}</td>
                <td className="pl-20 border-b text-left">{item.medida}</td>
                <td className="px-2 py-2 border-b">{item.importe}</td>
                <td className="px-2 py-2 border-b">{item.espece}</td>
                <td className="px-2 py-2 border-b space-x-1">
                  <button className="text-green-600 hover:text-green-800 text-xs"
                    onClick={() => mostrarModal(item._id)}
                  >Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        {/* Header con tabs */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Tablas del Sistema</h2>
          <div className="flex flex-wrap gap-2">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => setActiveTable(table.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${activeTable === table.id
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <span>{table.icon}</span>
                <span className="font-medium">{table.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800">
              {tables.find((t) => t.id === activeTable)?.label}
            </h3>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs">
                + Nuevo
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs">
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla con scroll */}
        <div className="flex-1 p-4 overflow-auto">{renderTable()}</div>
      </div>
    </div>
  )
}
