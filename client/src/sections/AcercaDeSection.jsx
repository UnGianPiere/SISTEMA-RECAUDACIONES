"use client"

import { useState } from "react"

function AcercaDeSection() {
  const [activeTab, setActiveTab] = useState("info")

  const tabs = [
    {
      id: "info",
      label: "Información",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "version",
      label: "Versión",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-4">
            {/* Hero Section compacto */}
            <div className="text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-center mb-3">
                <img src="/icon/Escudo.png" alt="Escudo" className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Sistema de Recaudaciones</h1>
              <p className="text-sm text-gray-600 mb-3 max-w-2xl mx-auto">
                Gobierno Regional de Junín - Archivo Regional
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Sistema Activo
              </div>
            </div>

            {/* Features Grid compacto */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Gestión de Recaudación</h3>
                <p className="text-gray-600 text-xs">Control completo de ingresos y comprobantes de pago.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Reportes</h3>
                <p className="text-gray-600 text-xs">Generación automática de reportes diarios y mensuales.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Gestión TUPA</h3>
                <p className="text-gray-600 text-xs">Administración del Texto Único de Procedimientos.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Análisis de Datos</h3>
                <p className="text-gray-600 text-xs">Estadísticas detalladas y análisis de tendencias.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Impresión Automática</h3>
                <p className="text-gray-600 text-xs">Generación e impresión de documentos.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Seguridad Avanzada</h3>
                <p className="text-gray-600 text-xs">Sistema seguro con control de acceso.</p>
              </div>
            </div>

            {/* Mission Statement compacto */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">Nuestra Misión</h2>
              <p className="text-gray-700 text-center text-sm leading-relaxed">
                Facilitar la gestión eficiente y transparente de los recursos del Archivo Regional de Junín,
                proporcionando herramientas tecnológicas modernas que optimicen los procesos de recaudación.
              </p>
            </div>
          </div>
        )

      case "version":
        return (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Versión del Sistema</h2>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-lg font-bold">
                  v2.1.0
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Fecha de Lanzamiento</h3>
                  <p className="text-gray-600 text-xs">2025</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Última Actualización</h3>
                  <p className="text-gray-600 text-xs">Julio 2025</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Estado</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Estable
                  </span>
                </div>
              </div>
            </div>



            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Tecnologías Utilizadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-lg mb-1">⚛️</div>
                  <div className="font-medium text-gray-800 text-xs">React</div>
                  <div className="text-xs text-gray-600">v18.2.0</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
                  <div className="text-lg mb-1">🟢</div>
                  <div className="font-medium text-gray-800 text-xs">Node.js</div>
                  <div className="text-xs text-gray-600">v18.17.0</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
                  <div className="text-lg mb-1">🍃</div>
                  <div className="font-medium text-gray-800 text-xs">MongoDB</div>
                  <div className="text-xs text-gray-600">v6.0</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-lg mb-1">🎨</div>
                  <div className="font-medium text-gray-800 text-xs">Tailwind</div>
                  <div className="text-xs text-gray-600">v3.3.0</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "support":
        return (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Centro de Soporte</h2>
                <p className="text-gray-600 text-sm">
                  Estamos aquí para ayudarte. Encuentra respuestas o contacta con nuestro equipo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Teléfono</h3>
                  <p className="text-gray-600 text-xs mb-2">
                    Lunes a Viernes
                    <br />
                    8:00 AM - 6:00 PM
                  </p>
                  <p className="font-medium text-green-600 text-xs">(064) 123-4567</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Email</h3>
                  <p className="text-gray-600 text-xs mb-2">Respuesta en 24 horas</p>
                  <p className="font-medium text-green-600 text-xs">soporte@gorejunin.gob.pe</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">Oficina</h3>
                  <p className="text-gray-600 text-xs mb-2">Visítanos personalmente</p>
                  <p className="font-medium text-green-600 text-xs">Jr. Ancash 123, Huancayo</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Preguntas Frecuentes</h3>
                <div className="space-y-2">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">¿Cómo genero un reporte mensual?</h4>
                    <p className="text-xs text-gray-600">
                      Vaya a "Reportes", seleccione el mes y año, y haga clic en "Generar Reporte".
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">¿Puedo anular un comprobante?</h4>
                    <p className="text-xs text-gray-600">
                      Sí, seleccione el comprobante y use el botón "Anular". Requiere confirmación.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">¿Cómo actualizo los datos del TUPA?</h4>
                    <p className="text-xs text-gray-600">
                      En "Tablas", seleccione TUPA y use "Editar" en el registro deseado.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 text-sm">¿El sistema guarda automáticamente?</h4>
                    <p className="text-xs text-gray-600">
                      Sí, todos los cambios se guardan automáticamente. También puede usar Ctrl+S.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Enviar Consulta</h3>
                <form className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs"
                      placeholder="Su nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs"
                      placeholder="su.email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Consulta</label>
                    <select className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs">
                      <option>Soporte Técnico</option>
                      <option>Error en el Sistema</option>
                      <option>Solicitud de Función</option>
                      <option>Consulta General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mensaje</label>
                    <textarea
                      rows={3}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs"
                      placeholder="Describa su consulta o problema..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Enviar Consulta
                  </button>
                </form>
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
        {/* Header compacto con tabs */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Acerca del Sistema</h2>
              <p className="text-xs text-gray-600">Información, versión y soporte técnico</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Centro de información</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md transform"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
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

export default AcercaDeSection
