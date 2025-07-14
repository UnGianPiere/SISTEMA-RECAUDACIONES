"use client"

import { useState } from "react"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white shadow-xl relative z-50 border-b border-slate-500">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <img
                src="/gorejunin.svg"
                alt="Logo Gobierno Regional de Junín"
                className="w-12 h-12 sm:w-16 sm:h-16 transition-transform hover:scale-105"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white truncate">
                Gobierno Regional de Junín
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 truncate">Dirección Regional de Archivo</p>
            </div>
          </div>

          {/* Información de usuario - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <div className="text-right">
              <span className="text-sm block font-medium">Usuario: Admin</span>
              <span className="text-xs text-emerald-300 flex items-center justify-end">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></div>
                Sesión activa
              </span>
            </div>
            <button className="bg-slate-500/70 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:shadow-lg border border-slate-400">
              Cerrar Sesión
            </button>
          </div>

          {/* Botón menú móvil */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-600 transition-colors flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-500 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <div className="text-center sm:text-left">
                <span className="text-sm font-medium">Usuario: Admin</span>
                <div className="text-xs text-emerald-300 flex items-center justify-center sm:justify-start mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></div>
                  Sesión activa
                </div>
              </div>
              <button className="bg-slate-500/70 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm w-full transition-all duration-200 border border-slate-400">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
