"use client"

import { useState } from "react"
import Modal from "../components/modals/PDFModal"

function ReportesSection() {

  const API =import.meta.env.VITE_API_URL;
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [toast, setToast] = useState(null);

  const [filtros, setFiltros] = useState({
    año: "2025",
    mes: "05",
  });

  const abrirModalConPDF = (tipoReporte) => {
    const url = `${API}/api/pdf/generar-pdf-mensual-${tipoReporte}/${filtros.año}/${filtros.mes}`;
    setPdfUrl(url);
    setModalVisible(true);
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    })
  }

  const añoActual = new Date().getFullYear();
  const añosRecientes = Array.from({ length: 5 }, (_, i) => añoActual - i);

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const reportes = [
    {
      id: 1,
      titulo: "INFORMACIÓN DE INGRESOS POR FUENTE DE FINANCIAMIENTO Y MONEDA",
      descripcion: "Reporte detallado de ingresos clasificados por fuente de financiamiento",
      fecha: "Mayo 2025",
      tipo: "PDF",
      tipoAPI: "ingresos",
    },
    {
      id: 2,
      titulo: "RESUMEN DE RECAUDACIÓN DE INGRESOS DE ACUERDO AL T-5",
      descripcion: "Resumen mensual de recaudación según formato T-5",
      fecha: "Mayo 2025",
      tipo: "PDF",
      tipoAPI: "recaudacion",
    },
    {
      id: 3,
      titulo: "HOJA DE TRABAJO",
      descripcion: "Hoja de trabajo con cálculos y análisis mensual",
      fecha: "Mayo 2025",
      tipo: "PDF",
      tipoAPI: "hoja-trabajo",
    },
    {
      id: 4,
      titulo: "DOCUMENTOS ANULADOS",
      descripcion: "Listado de documentos anulados en el período",
      fecha: "Mayo 2025",
      tipo: "PDF",
      tipoAPI: "doc-anulado",
    },
    {
      id: 5,
      titulo: "DOCUMENTOS EMITIDOS",
      descripcion: "Registro completo de documentos emitidos",
      fecha: "Mayo 2025",
      tipo: "PDF",
      tipoAPI: "doc-emitido",
    },
  ];

  const handleDescargar = async (tipoAPI) => {
    try {
      const url = `${API}/api/pdf/generar-pdf-mensual-${tipoAPI}/${filtros.año}/${filtros.mes}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `reporte-${tipoAPI}-${filtros.año}-${filtros.mes}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast("✅ Descarga completada");
    } catch (error) {
      console.error("❌ Error al descargar PDF:", error);
      showToast("❌ Error al descargar PDF");
    }
  };

  const handleImprimir = async (tipoAPI) => {
    try {
      const url = `${API}/api/pdf/generar-pdf-mensual-${tipoAPI}/${filtros.año}/${filtros.mes}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        showToast("🖨️ Imprimiendo...");
      };
    } catch (error) {
      console.error("❌ Error al imprimir PDF:", error);
      showToast("❌ Error al imprimir PDF");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white text-sm px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pdfUrl={pdfUrl}
      />

      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Reportes Mensuales</h2>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Año</label>
              <select
                name="año"
                value={filtros.año}
                onChange={handleFiltroChange}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                {añosRecientes.map((año) => (
                  <option key={año} value={año}>
                    {año}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mes</label>
              <select
                name="mes"
                value={filtros.mes}
                onChange={handleFiltroChange}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reportes */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-3">
            {reportes.map((reporte) => (
              <div key={reporte.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{reporte.titulo}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{reporte.descripcion}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{reporte.fecha}</span>
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${reporte.tipo === "PDF" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {reporte.tipo}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 lg:flex-nowrap">
                    <button
                      onClick={() => abrirModalConPDF(reporte.tipoAPI)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDescargar(reporte.tipoAPI)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Descargar
                    </button>
                    <button
                      onClick={() => handleImprimir(reporte.tipoAPI)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesSection
