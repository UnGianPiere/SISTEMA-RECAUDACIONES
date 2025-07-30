"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentSection = location.pathname.replace("/", "") || "recaudacion"

  const menuItems = [
    {
      id: "recaudacion",
      label: "Recaudación",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
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
      id: "reportes",
      label: "Reportes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      id: "tablas",
      label: "Tablas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "herramientas",
      label: "Herramientas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: "acerca-de",
      label: "Acerca de",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  const handleNavigate = (id) => {
    navigate(`/${id}`)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[5] lg:z-10 w-64 lg:w-72 bg-white shadow-xl transform transition-all duration-500 ease-out border-r border-gray-200 h-full ${isMobileOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100"
          }`}
      >
        <div className="h-full overflow-y-auto pt-20 lg:pt-6">
          {/* Logo en sidebar móvil */}
          <div className="lg:hidden px-4 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img src="/gorejunin.svg" alt="Logo" className="w-10 h-10" />
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Gobierno Regional</h2>
                <p className="text-xs text-gray-600">Sistema de Recaudaciones</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                <li key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out transform group ${currentSection === item.id
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-l-4 border-blue-600 shadow-lg scale-[1.02]"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-blue-700 hover:shadow-md hover:scale-[1.01]"
                      }`}
                  >
                    <span
                      className={`transition-all duration-300 ease-out transform ${currentSection === item.id ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-blue-600 group-hover:scale-105"
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay para móvil */}
      <div
        className={`lg:hidden fixed inset-0 z-[4] bg-black/10 transition-all duration-500 ease-out ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileOpen(false)}
      />
    </>
  )
}

export default Sidebar
