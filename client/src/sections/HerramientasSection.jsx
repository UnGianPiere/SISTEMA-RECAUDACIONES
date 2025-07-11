"use client"

import { useState } from "react"

function HerramientasSection() {
  const [configuracion, setConfiguracion] = useState({
    tema: "claro",
    idioma: "es",
    notificaciones: true,
    autoGuardado: true,
    formatoFecha: "dd/mm/yyyy",
    monedaPredeterminada: "PEN",
  })

  const handleConfigChange = (key, value) => {
    setConfiguracion({
      ...configuracion,
      [key]: value,
    })
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Herramientas y Configuración</h2>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Configuración de Visualización */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Configuración de Visualización</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tema</label>
                  <select
                    value={configuracion.tema}
                    onChange={(e) => handleConfigChange("tema", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="claro">Claro</option>
                    <option value="oscuro">Oscuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Formato de Fecha</label>
                  <select
                    value={configuracion.formatoFecha}
                    onChange={(e) => handleConfigChange("formatoFecha", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Moneda</label>
                  <select
                    value={configuracion.monedaPredeterminada}
                    onChange={(e) => handleConfigChange("monedaPredeterminada", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PEN">Soles (PEN)</option>
                    <option value="USD">Dólares (USD)</option>
                    <option value="EUR">Euros (EUR)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Notificaciones</label>
                    <button
                      onClick={() => handleConfigChange("notificaciones", !configuracion.notificaciones)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        configuracion.notificaciones ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          configuracion.notificaciones ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Auto-guardado</label>
                    <button
                      onClick={() => handleConfigChange("autoGuardado", !configuracion.autoGuardado)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        configuracion.autoGuardado ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          configuracion.autoGuardado ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Herramientas de Mantenimiento */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Herramientas de Mantenimiento</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Sincronizar BD</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  <span>Generar Respaldo</span>
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Limpiar Archivos</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Optimizar Sistema</span>
                </button>
              </div>
            </div>

            {/* Importar/Exportar */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800 mb-3">Importar/Exportar</h3>
              <div className="space-y-2">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Importar Datos</span>
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  <span>Exportar Datos</span>
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Plantillas</span>
                </button>
              </div>
            </div>

            {/* Configuración Avanzada */}
            <div className="bg-red-50 p-4 rounded-lg lg:col-span-2 xl:col-span-1">
              <h3 className="text-sm font-medium text-red-800 mb-3">Configuración Avanzada</h3>
              <div className="space-y-2">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Configurar API</span>
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Gestionar Permisos</span>
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs text-left transition-colors flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Logs del Sistema</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Cancelar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HerramientasSection
