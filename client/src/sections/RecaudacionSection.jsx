"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import GenericModal from "../components/GenericModal"
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/modals/ModalConfirmacion'

function RecaudacionSection() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    sector: "03 ARCHIVO REGIONAL JUNIN",
    accion: "01 Captación de Ingresos",
    fuenteFinanciamiento: "02 Recursos Directamente Recaudad",
    cuentaCorriente: "01 381021866 BCP - DIR - RECAUDADOS",
    concepto: "",
    tipoFormato: "Recibo de Ingreso a Caja",
    numeroRecibo: "",
    ultimoRIC: ""
  })

  const [totales, setTotales] = useState({ debe: 0, haber: 0 })
  const [loading, setLoading] = useState(false)
  const [printNum, setPrintNum] = useState()
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [datosSeleccion, setDatosSeleccion] = useState(null)
  const [ultimoRegistro, setUltimoRegistro] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [resultado, setResultado] = useState({ fecha: "", total: 0, comprobantes: [] })
  const [nuevoRecibo, setNuevoRecibo] = useState(null)
  const [modalNuevoRecibo, setModalNuevoRecibo] = useState(false)
  
  const urlUri=import.meta.env.VITE_API_URL;

  const [datosRegistro, setDatosRegistro] = useState({
    nombre: "",
    direccion: "",
    tipoDocumento: "",
    numeroDocumento: "",
  })


  const abrirModal = (tipo, data = null) => {
    setModalType(tipo)
    setModalData(data)
    setModalOpen(true)
  }
  const cerrarModal = () => {
    setModalOpen(false)
    setModalType(null)
    setModalData(null)
  }


  const handleNewReceipt = () => {
    setModalNuevoRecibo(true)
  }

  const handleConfirmar = async () => {
    const dataNuevoRecibo = {
      _id: nuevoRecibo + 1,
      ctapa1: "1101.0101",
      ctapa2: "1101.0101",
      total: 0
    }
    try {
      const response = await axios.post(`${urlUri}/api/reporte-diario`, dataNuevoRecibo);
      console.log("✅ Nuevo recibo creado:", response.data);
    } catch (error) {
      console.error("❌ Error al crear nuevo recibo:", error);
    }
    navigate(0);
  }

  const handleContinuar = (e) => {
    e.preventDefault();

    const datosAEnviar = {
      ...datosRegistro,
      ultimoreg: ultimoRegistro,
      numeroRecibo: printNum
    };

    console.log("Datos a enviar:", datosRegistro);
    navigate('/TupaSeccion', { state: { datosRegistro: datosAEnviar } })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddCuenta = () => {

    const fetchData = async () => {
      try {
        const data = await fetch(`${urlUri}/api/comprobantes/ultimo`)
        const json = await data.json()
        setUltimoRegistro(json._id + 1)
      } catch (error) {
        console.error(`El error es: ${error}`)
      }
    }
    fetchData()
    abrirModal("cuenta")
  }

  const handleEdit = (item) => {
    abrirModal("editar", resultado.comprobantes[filaSeleccionada])
  }

  const handlePrint = async () => {
    try {
      const url = `${urlUri}/api/pdf/generar-pdf/${printNum}`;
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

  }

  const handleExtraFunction = () => {
    abrirModal("anular", resultado.comprobantes[filaSeleccionada])
  }

  const ponerDatos = async (input) => {
    let valor = typeof input === "string" ? input.trim() : input?.target?.value.trim();
    if (!valor) return;
    setPrintNum(valor);

    try {
      setLoading(true);
      const response = await axios.get(`${urlUri}/api/reporte-diario/ingresos/${valor}`);
      const { reporte, comprobantes } = response.data;

      setResultado({
        id: reporte._id,
        fecha: reporte.fecha.split("T")[0],
        total: reporte.total,
        comprobantes: comprobantes.map(c => ({
          id: c._id,
          nombre: c.nombre,
          anulado: c.anulado,
          serie: c.serie,
          dni: c.dni,
          ruc: c.ruc,
          direccion: c.direccion || "",
          igv: c.igv || 'N'
        }))
      });

      setTotales({ debe: reporte.total || 0, haber: reporte.total || 0 });

    } catch (err) {
      console.error("❌ Error al consultar el recibo:", err);
      setResultado({
        id: "",
        fecha: "",
        total: 0,
        comprobantes: []
      });
      setTotales({ debe: 0, haber: 0 });

    } finally {
      setLoading(false);
    }
  };

  const ponerDatos2 = async (id) => {
    if (!id) return
    try {
      const response = await axios.get(`${urlUri}/api/reporte-diario/ingresos/${id}`)
      const { reporte, comprobantes } = response.data

      setResultado({
        id: reporte._id,
        fecha: reporte.fecha.split("T")[0],
        total: reporte.total,
        comprobantes: comprobantes.map(c => ({
          id: c._id,
          nombre: c.nombre,
          anulado: c.anulado,
          serie: c.serie,
          dni: c.dni,
          ruc: c.ruc,
          direccion: c.direccion || "",
          igv: c.igv || 'N'
        }))
      })

      setTotales({ debe: reporte.total || 0, haber: reporte.total || 0 })
    } catch (err) {
      console.error("Error al consultar el recibo", err)
    }
  }

  const cargarUltimoRIC = async () => {
    try {
      const response = await axios.get(`${urlUri}/api/reporte-diario/reportes/ultimo`);
      const ultimoID = response.data?._id || "";
      setPrintNum(ultimoID)
      if (ultimoID) {
        setFormData(prev => ({
          ...prev,
          ultimoRIC: ultimoID,
          numeroRecibo: ultimoID,
        }));
        ponerDatos2(ultimoID);
        setNuevoRecibo(ultimoID)
      }
    } catch (error) {
      console.log("Error al obtener último RIC:", error);
    }
  };

  useEffect(() => {
    cargarUltimoRIC()
  }, [])

  return (
    <div className="h-full flex flex-col space-y-4">

      <ConfirmModal
        isOpen={modalNuevoRecibo}
        onClose={() => setModalNuevoRecibo(false)}
        onConfirm={handleConfirmar}
        message="¿Estas seguro de crear un nuevo recibo?"
      />

      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recibo de Ingreso a Caja</h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <label className="block text-xs font-medium text-gray-700 mb-1">N° Recibo</label>
              <input
                type="text"
                name="numeroRecibo"
                value={formData.numeroRecibo}
                onChange={(e) => {
                  handleInputChange(e)
                  ponerDatos(e)
                }}
                className="text-lg font-bold text-blue-600 border border-gray-300 rounded px-2 py-1 w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-center">
              <label className="block text-xs font-medium text-gray-700 mb-1">Último R.I.C.</label>
              <input
                type="text"
                name="ultimoRIC"
                value={formData.ultimoRIC}
                readOnly
                className="text-lg font-bold text-blue-600 border border-gray-300 rounded px-2 py-1 w-20 text-center bg-gray-50"
              />
            </div>

            {loading && (
              <div className="flex items-center space-x-2">
                <div className="spinner border-blue-600"></div>
                <span className="text-xs text-gray-600">Cargando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Columna 1 */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={resultado.fecha ?? ""}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sector</label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Acción</label>
                <input
                  type="text"
                  name="accion"
                  value={formData.accion}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fte.Fto.</label>
                <input
                  type="text"
                  name="fuenteFinanciamiento"
                  value={formData.fuenteFinanciamiento}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cta.Cte.</label>
                <input
                  type="text"
                  name="cuentaCorriente"
                  value={formData.cuentaCorriente}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Concepto</label>
                <input
                  type="text"
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Columna 3 */}
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-blue-800">Tipo de Formato</label>
                <select
                  name="tipoFormato"
                  value={formData.tipoFormato}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-2 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Recibo de Ingreso a Caja">Recibo de Ingreso a Caja</option>
                  <option value="Nota de Depósito Bancario">Nota de Depósito Bancario</option>
                </select>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-gray-800">Totales</label>
                <div className="flex justify-between mt-1">
                  <div>
                    <span className="block text-xs text-gray-600">Debe (RIC)</span>
                    <div className="font-bold text-sm">{totales.debe.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-600">Haber (HDB)</span>
                    <div className="font-bold text-sm">{totales.haber.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de documentos */}
          <div className="mt-6">
            <div className="flex justify-end gap-3 items-center mb-2">
              <div>
                <button
                  onClick={handleAddCuenta}
                  className="bg-gray-300/70 p-1 border-r border-b border-gray-600 rounded-md active:translate-y-1 active:shadow-sm transition transform"
                >
                  <svg className="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M12 13V17M14 15H10" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>


              <button onClick={handlePrint} className="bg-gray-300/70 p-1 border-r border-b border-gray-600 rounded-md active:translate-y-1 active:shadow-sm transition transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18H6.2C5.0799 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V10.2C3 9.0799 3 8.51984 3.21799
                    8.09202C3.40973 7.71569 3.71569 7.40973 4.09202 7.21799C4.51984 7 5.0799 7 6.2 7H7M17 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843
                    20.782 16.908C21 16.4802 21 15.9201 21 14.8V10.2C21 9.07989 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H17M7 
                    11H7.01M17 7V5.4V4.6C17 4.03995 17 3.75992 16.891 3.54601C16.7951 3.35785 16.6422 3.20487 16.454 3.10899C16.2401 3 15.9601 3 15.4 3H8.6C8.03995 3 7.75992 3 7.54601
                    3.10899C7.35785 3.20487 7.20487 3.35785 7.10899 3.54601C7 3.75992 7 4.03995 7 4.6V5.4V7M17 7H7M8.6 21H15.4C15.9601 21 16.2401 21 16.454 20.891C16.6422 20.7951
                    16.7951 20.6422 16.891 20.454C17 20.2401 17 19.9601 17 19.4V16.6C17 16.0399 17 15.7599 16.891 15.546C16.7951 15.3578 16.6422 15.2049 16.454 15.109C16.2401 15 
                    15.9601 15 15.4 15H8.6C8.03995 15 7.75992 15 7.54601 15.109C7.35785 15.2049 7.20487 15.3578 7.10899 15.546C7 15.7599 7 16.0399 7 16.6V19.4C7 19.9601 7 20.2401 
                    7.10899 20.454C7.20487 20.6422 7.35785 20.7951 7.54601 20.891C7.75992 21 8.03995 21 8.6 21Z" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button onClick={handleNewReceipt} className="bg-gray-300/70 p-1 border-r border-b border-gray-600 rounded-md active:translate-y-1 active:shadow-sm transition transform">
                <svg className="w-6" viewBox="-4 0 34 34" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fill-rule="evenodd">
                    <g>
                      <path d="M1 1.993c0-.55.45-.993.995-.993h17.01c.55 0 1.34.275 1.776.625l3.44 2.75c.43.345.78 1.065.78 1.622v26.006c0 .55-.447.997-1 .997H2c-.552 0-1-.452-1-.993V1.993z" stroke="#474747" stroke-width="2.4" />
                      <path fill="#474747" d="M18 2h1v6h-1z" />
                      <path fill="#474747" d="M18 7h6v1h-6z" />
                    </g>
                  </g>
                </svg>
              </button>

            </div>

            <div className="overflow-y-auto max-h-80 border border-gray-200 rounded-md">
              <table className="min-w-full text-xs text-center border-collapse">
                <thead className="bg-blue-50">
                  <tr>
                    <th>TD</th>
                    <th>Serie</th>
                    <th>Nro</th>
                    <th>IGV</th>
                    <th>RUC</th>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Anulado</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.comprobantes?.map((doc, index) => (
                    <tr key={doc.id || index}
                      className={`hover:bg-gray-100 cursor-pointer ${filaSeleccionada === index ? 'bg-blue-100' : ''
                        }`}
                      onClick={() => {
                        setFilaSeleccionada((prev) => (prev === index ? null : index));
                        setDatosSeleccion(doc);
                      }}>
                      <td>CC</td>
                      <td>00{doc.serie}</td>
                      <td>0{doc.id}</td>
                      <td>{doc.igv}</td>
                      <td>{doc.ruc}</td>
                      <td>{doc.dni}</td>
                      <td>{doc.nombre}</td>
                      <td>{doc.direccion || "No registrado"}</td>
                      <td>{doc.anulado ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-2">

            {filaSeleccionada !== null && (
              <div>
                <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs mx-3">EDITAR</button>
                <button onClick={handleExtraFunction} className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs mr-10">ANULAR</button>
              </div>
            )}
          </div>
          <div className="text-right text-sm">
            <div className="text-xs text-gray-600">Retención: 0.00</div>
            <div className="font-bold text-blue-700">Total: S/ {resultado.total?.toFixed(2) ?? "0.00"}</div>
          </div>
        </div>

        <GenericModal isOpen={modalOpen} onClose={cerrarModal}>
          {/* Contenido del modal según tipo */}
          {modalType === "editar" && (
            <>
              <h2 className="text-lg font-bold mb-4">Editar Comprobante</h2>
              {/* campos */}

              <div className="p-6 bg-white rounded-lg shadow-md">
                <form className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nro</label>
                      <input type="text" readOnly value={datosSeleccion.id} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" value={datosSeleccion.nombre} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <input
                    type="text"
                    value={
                      datosSeleccion.dni && datosSeleccion.dni !== "0" && datosSeleccion.dni.length === 8
                        ? datosSeleccion.dni
                        : datosSeleccion.ruc && datosSeleccion.ruc !== "0" && datosSeleccion.ruc.length === 11
                          ? datosSeleccion.ruc
                          : ''
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input type="text" value={datosSeleccion.direccion} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 mx-5 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

            </>
          )}
          {modalType === "anular" && (
            <>
              <h2 className="text-lg font-bold mb-4">Confirmar Anulación</h2>
              {/* confirmación */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                Desea anular este Registro <br />
                <button
                  className="bg-blue-600 text-white px-4 mx-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Aceptar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
          {modalType === "cuenta" && (
            <>
              <h2 className="text-lg font-bold mb-4">Agregar Registro</h2>
              {/* campos */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <form className="space-y-4" onSubmit={handleContinuar}>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo Doc</label>
                      <input type="text" value="03 Comprobate de caja" readOnly className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Serie</label>
                      <input type="text" readOnly value={4} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nro</label>
                      <input type="text" readOnly value={ultimoRegistro} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={datosRegistro.nombre}
                      name="nombre"
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo Documento</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      name="tipoDocumento"
                      value={datosRegistro.tipoDocumento}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="ruc">RUC</option>
                      <option value="dni">DNI</option>
                    </select>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      name="numeroDocumento"
                      required
                      value={datosRegistro.numeroDocumento}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      name="direccion"
                      value={datosRegistro.direccion}
                      onChange={handleChange} />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Continuar Registro
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </GenericModal>


      </div>
    </div>
  )
}

export default RecaudacionSection
