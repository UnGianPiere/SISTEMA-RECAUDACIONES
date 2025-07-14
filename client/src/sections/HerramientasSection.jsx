"use client"

import { useState } from "react"

function HerramientasSection() {
  const [activeTab, setActiveTab] = useState("backup")

  const tools = [
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
    {
      id: "maintenance",
      title: "Mantenimiento",
      description: "Optimización del sistema",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
    },
    {
      id: "logs",
      title: "Registros",
      description: "Logs del sistema",
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
      color: "from-purple-500 to-purple-600",
    },
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
  ]

  const renderContent = () => {
    switch (activeTab) {
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

      case "maintenance":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-green-800 mb-1">Limpiar Cache</h4>
                <p className="text-green-700 text-xs mb-2">Eliminar archivos temporales</p>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  Limpiar
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-blue-800 mb-1">Optimizar BD</h4>
                <p className="text-blue-700 text-xs mb-2">Optimizar base de datos</p>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  Optimizar
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-purple-800 mb-1">Estadísticas</h4>
                <p className="text-purple-700 text-xs mb-2">Ver uso del sistema</p>
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  Ver Stats
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Estado del Sistema</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-green-50 rounded-md p-2 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600">Base de Datos</p>
                      <p className="text-lg font-bold text-green-800">OK</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-md p-2 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600">Servidor</p>
                      <p className="text-lg font-bold text-blue-800">OK</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-md p-2 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-yellow-600">Espacio</p>
                      <p className="text-lg font-bold text-yellow-800">75%</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-md p-2 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-600">Memoria</p>
                      <p className="text-lg font-bold text-purple-800">45%</p>
                    </div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "logs":
        return (
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h4 className="text-sm font-bold text-gray-800">Registros del Sistema</h4>
                <div className="flex gap-1">
                  <select className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                    <option>Todos los niveles</option>
                    <option>Error</option>
                    <option>Warning</option>
                    <option>Info</option>
                  </select>
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    Actualizar
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-md p-3 max-h-64 overflow-y-auto font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-green-400">[2025-01-07 10:30:15] INFO: Sistema iniciado correctamente</div>
                  <div className="text-blue-400">[2025-01-07 10:30:16] DEBUG: Conexión a base de datos establecida</div>
                  <div className="text-yellow-400">[2025-01-07 10:35:22] WARNING: Cache casi lleno (85%)</div>
                  <div className="text-green-400">[2025-01-07 10:40:33] INFO: Nuevo usuario conectado</div>
                  <div className="text-red-400">[2025-01-07 10:45:12] ERROR: Fallo en conexión temporal</div>
                  <div className="text-green-400">[2025-01-07 10:45:15] INFO: Conexión restaurada</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "config":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Configuración General</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Sistema</label>
                    <input
                      type="text"
                      defaultValue="Sistema de Recaudaciones"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Zona Horaria</label>
                    <select className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs">
                      <option>America/Lima</option>
                      <option>America/Bogota</option>
                      <option>America/Mexico_City</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Modo Mantenimiento</span>
                    <button className="relative inline-flex h-4 w-8 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-1">
                      <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-0.5"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Configuración de Seguridad</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tiempo de Sesión (min)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">2FA</span>
                    <button className="relative inline-flex h-4 w-8 items-center rounded-full bg-orange-600 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-1">
                      <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-4"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Logs de Auditoría</span>
                    <button className="relative inline-flex h-4 w-8 items-center rounded-full bg-orange-600 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-1">
                      <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-4"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200">
                Guardar Configuración
              </button>
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
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-md transform scale-105`
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
