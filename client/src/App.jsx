"use client"

import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import RecaudacionSection from "./sections/RecaudacionSection"
import ReportesSection from "./sections/ReportesSection"
import TablasSection from "./sections/TablasSection"
import HerramientasSection from "./sections/HerramientasSection"
import AcercaDeSection from "./sections/AcercaDeSection"
import TupaSeccion from "./sections/RecaudacionTupaSeccion"
import LoginPage from "./components/LoginPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const currentPath = location.pathname.replace("/", "") || "recaudacion"

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    activeSection={currentPath}
                    onNavigate={(section) => navigate(`/${section}`)}
                  />
                  <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Routes>
                      <Route path="/" element={<RecaudacionSection />} />
                      <Route path="/recaudacion" element={<RecaudacionSection />} />
                      <Route path="/reportes" element={<ReportesSection />} />
                      <Route path="/tablas" element={<TablasSection />} />
                      <Route path="/herramientas" element={<HerramientasSection />} />
                      <Route path="/acerca-de" element={<AcercaDeSection />} />
                      <Route path="/tupaseccion" element={<TupaSeccion />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
