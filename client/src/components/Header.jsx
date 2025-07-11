"use client"

import { useState } from "react"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-600 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-1 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className=" h-15 flex items-center justify-center">
              <img
                src="/gorejunin.svg"
                alt="Logo Gobierno Regional de Junín"
                className="w-16 h-16"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">Gobierno Regional de Junín</h1>
              <p className="text-blue-100 text-sm">Sistema de Recaudaciones</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm block">Usuario: Admin</span>
              <span className="text-xs text-green-200">Sesión activa</span>
            </div>
            <button className="bg-blue-400/65 hover:bg-blue-900 px-4 py-2 rounded text-sm transition-colors">
              Cerrar Sesión
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-blue-600">
            <div className="flex flex-col space-y-2">
              <span className="text-sm">Usuario: Admin</span>
              <button className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded text-sm w-full text-left">
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
