"use client"

import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import RecaudacionSection from "./sections/RecaudacionSection"
import ReportesSection from "./sections/ReportesSection"
import TablasSection from "./sections/TablasSection"
import HerramientasSection from "./sections/HerramientasSection"
import AcercaDeSection from "./sections/AcercaDeSection"
import TupaSeccion from "./sections/RecaudacionTupaSeccion"

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname.replace("/", "") || "recaudacion"

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-0 p-4">
          <Sidebar
            activeSection={currentPath}
            onNavigate={(section) => navigate(`/${section}`)}
          />
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
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
  )
}

export default App
