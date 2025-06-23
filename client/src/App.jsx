import { useState } from 'react'
import './App.css'
import ReporteTabla from './components/ReporteTabla'




function App() {
  const [reporteId, setReporteId] = useState("");
  const [datos, setDatos] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reporteId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reporte-diario/ingresos/${reporteId}`);
      const data = await res.json();
      setDatos(data);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center gap-4 p-6 bg-white shadow"
        >
          <input
            type="number"
            value={reporteId}
            onChange={(e) => setReporteId(e.target.value)}
            placeholder="Número de reporte"
            className="border rounded px-4 py-2 w-60"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        <main className="flex justify-center p-6">
          {datos ? (
            <ReporteTabla datos={datos} />
          ) : (
            <p className="text-gray-500">Ingrese un número de reporte para ver resultados.</p>
          )}
        </main>
      </div>
    </>
  )
}

export default App