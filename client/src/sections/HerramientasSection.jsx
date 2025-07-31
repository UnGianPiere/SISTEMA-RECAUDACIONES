"use client"
import axios from 'axios';
import { useState } from "react"
import { useConfig } from '../app/config/useConfig'

function HerramientasSection() {
  const [activeTab, setActiveTab] = useState("config")
  const [previewTheme, setPreviewTheme] = useState("light")
  const [isBackupLoading, setIsBackupLoading] = useState(false)
  const { selectedYear, setSelectedYear, theme, setTheme } = useConfig();

  const API = import.meta.env.VITE_API_URL


  const handleChangeAnio = (e) => {
    setSelectedYear(parseInt(e.target.value))
  }

  const descargarBackup = async () => {
    setIsBackupLoading(true);
    try {
      const response = await axios.get(`${API}/api/backup`, {
        responseType: 'blob', // importante para recibir el archivo como blob
      });

      // Crear una URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const fecha= new Date()
      const formatoES = fecha.toLocaleDateString('es-PE')
      // Crear un enlace temporal
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Backup_con_fecha_del_${formatoES}.zip`); // nombre del archivo
      document.body.appendChild(link);
      link.click();

      // Limpiar
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el backup:', error);
    } finally {
      setIsBackupLoading(false);
    }
  };

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
      description: "Generar respaldos de la base de datos",
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
        const years = Array.from({ length: currentYear - 2013 + 1 }, (_, i) => currentYear - i);

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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                          theme === 'light'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Claro</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                          theme === 'dark'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Oscuro</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Vista Previa del Tema</h4>
                <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Vista previa del tema</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${previewTheme === 'light' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                      <span className="text-xs text-gray-600 capitalize">{previewTheme === 'light' ? 'Claro' : 'Oscuro'}</span>
                    </div>
                  </div>
                  
                  {/* Botón para cambiar tema de la vista previa */}
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
                      className="px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span>Cambiar Vista Previa</span>
                    </button>
                  </div>
                  
                  {/* Vista previa pequeña y siempre visible */}
                  <div className={`h-20 rounded-md border transition-all duration-300 ${
                    previewTheme === 'light' 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-800 border-gray-600'
                  }`}>
                    <div className="p-2 h-full">
                      {/* Mini interfaz */}
                      <div className="flex space-x-1 h-full">
                        {/* Mini sidebar */}
                        <div className={`w-8 rounded ${
                          previewTheme === 'light' ? 'bg-blue-500' : 'bg-blue-600'
                        } flex items-center justify-center`}>
                          <span className="text-xs text-white font-bold">S</span>
                        </div>
                        
                        {/* Mini contenido */}
                        <div className={`flex-1 rounded ${
                          previewTheme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                        } p-1`}>
                          <div className="flex items-center space-x-1 mb-1">
                            <div className={`w-2 h-2 rounded ${
                              previewTheme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                            }`}></div>
                            <span className={`text-xs font-medium ${
                              previewTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>Mini</span>
                          </div>
                          
                          {/* Mini botones */}
                          <div className="flex space-x-1">
                            <div className={`w-4 h-3 rounded text-xs flex items-center justify-center ${
                              previewTheme === 'light' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-blue-600 text-white'
                            }`}>B</div>
                            <div className={`w-4 h-3 rounded text-xs flex items-center justify-center ${
                              previewTheme === 'light' 
                                ? 'bg-gray-300 text-gray-600' 
                                : 'bg-gray-600 text-gray-300'
                            }`}>B</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )

      case "backup":
        return (
          <div className="space-y-3 px-30"> 
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
                <button
                  onClick={descargarBackup}
                  disabled={isBackupLoading}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isBackupLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}>
                  {isBackupLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Generando Backup...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Crear Respaldo Ahora</span>
                    </>
                  )}
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
                className={`flex items-center space-x-2 p-2 rounded-lg text-left transition-all duration-200 ${activeTab === tool.id
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
