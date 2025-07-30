"use client"

import { useState } from "react"
import { useConfig } from '../app/config/useConfig'

function HerramientasSection() {
  const [activeTab, setActiveTab] = useState("backup")
  const { selectedYear, setSelectedYear, theme, setTheme } = useConfig();

  const handleChangeAnio = (e)=>{
    setSelectedYear(parseInt(e.target.value))
  }

  const tools = [
    {
      id: "config",
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "backup",
      title: "Respaldo",
      description: "Crear y restaurar copias",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
    },
    
  ]

  const renderContent = () => {
    switch (activeTab) {

      case "config":
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: currentYear - 2013 + 1}, (_, i) => currentYear - i);
        
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Configuración General</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Año de Trabajo</label>
                    <select 
                    value={selectedYear}
                    onChange={handleChangeAnio}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs">
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tema del Sistema</label>
                    <select 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs">
                      <option value="light">Tema Claro</option>
                      <option value="dark">Tema Oscuro</option>
                      <option value="system">Usar Tema del Sistema</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Vista Previa del Tema</h4>
                <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Vista previa del tema seleccionado</span>
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="h-20 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Previsualización del tema</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )

      case "backup":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Crear Respaldo</span>
                </h4>
                <p className="text-blue-700 mb-2 text-xs">Genere una copia de seguridad completa</p>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  Crear Respaldo Ahora
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l-4-4m4 4H8m4 0V4"
                    />
                  </svg>
                  <span>Restaurar Datos</span>
                </h4>
                <p className="text-green-700 mb-2 text-xs">Restaure desde una copia de seguridad</p>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".sql,.backup"
                    className="w-full text-xs text-green-700 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-800 hover:file:bg-green-200"
                  />
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    Restaurar Sistema
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Historial de Respaldos</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">2025-01-07 10:30:00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">2.5 MB</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Exitoso
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-2 text-xs">Descargar</button>
                        <button className="text-red-600 hover:text-red-900 text-xs">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col space-y-2 p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col min-h-0 border border-gray-200">
        {/* Header compacto */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-orange-50 to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Herramientas del Sistema</h2>
              <p className="text-xs text-gray-600">Administre y mantenga el sistema</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Herramientas administrativas</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center space-x-2 p-2 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tool.id
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-md transform`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>{tool.icon}</span>
                <div>
                  <div className="font-bold text-xs">{tool.title}</div>
                  <div className="text-xs opacity-90">{tool.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content compacto */}
        <div className="flex-1 p-3 sm:p-4 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  )
}

export default HerramientasSection
