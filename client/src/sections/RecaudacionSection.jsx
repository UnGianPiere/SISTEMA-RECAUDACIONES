"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import GenericModal from "../components/GenericModal"
import { useNavigate } from "react-router-dom"
import ConfirmModal from "../components/modals/ModalConfirmacion"

function RecaudacionSection() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    sector: "03 ARCHIVO REGIONAL JUNIN",
    accion: "01 Captación de Ingresos",
    fuenteFinanciamiento: "02 Recursos Directamente Recaudados",
    cuentaCorriente: "01 381021866 REC - DIR - RECAUDADOS",
    concepto: "",
    tipoFormato: "Recibo de Ingreso a Caja",
    numeroRecibo: "",
    ultimoRIC: "",
  })

  const [totales, setTotales] = useState({ debe: 0, haber: 0 })
  const [loading, setLoading] = useState(false)
  const [printNum, setPrintNum] = useState()
  const [filaSeleccionada, setFilaSeleccionada] = useState(null)
  const [datosSeleccion, setDatosSeleccion] = useState(null)
  const [ultimoRegistro, setUltimoRegistro] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [resultado, setResultado] = useState({ fecha: "", total: 0, comprobantes: [] })
  const [nuevoRecibo, setNuevoRecibo] = useState(null)
  const [modalNuevoRecibo, setModalNuevoRecibo] = useState(false)

  const [dataEdit, setDataEdit] = useState({
    nombre: "",
    direccion: "",
    documento: ""
  })

  const [loadingPDF, setLoadingPDF] = useState(false)


  const urlUri = import.meta.env.VITE_API_URL

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
      total: 0,
    }
    try {
      const response = await axios.post(`${urlUri}/api/reporte-diario`, dataNuevoRecibo)
      console.log("✅ Nuevo recibo creado:", response.data)
    } catch (error) {
      console.error("❌ Error al crear nuevo recibo:", error)
    }
    navigate(0)
  }

  const handleContinuar = (e) => {
    e.preventDefault()
    // Validar longitud del documento
    if (datosRegistro.tipoDocumento === "dni" && datosRegistro.numeroDocumento.length !== 8) {
      alert("El DNI debe tener exactamente 8 dígitos");
      return;
    }
    if (datosRegistro.tipoDocumento === "ruc" && datosRegistro.numeroDocumento.length !== 11) {
      alert("El RUC debe tener exactamente 11 dígitos");
      return;
    }
    const datosAEnviar = {
      ...datosRegistro,
      ultimoreg: ultimoRegistro,
      numeroRecibo: printNum,
    }
    console.log("Datos a enviar:", datosRegistro)
    navigate("/TupaSeccion", { state: { datosRegistro: datosAEnviar } })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "numeroDocumento") {
      const tipo = datosRegistro.tipoDocumento;
      if (tipo === "dni" && value.length > 8) return;
      if (tipo === "ruc" && value.length > 11) return;
    }
    setDatosRegistro((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  // Estado para el formulario de edición
  const [editForm, setEditForm] = useState({ nombre: '', direccion: '', documento: '' })

  // Cuando se abre el modal de editar, inicializa el formulario con los datos seleccionados
  const handleEdit = (item) => {
    const doc = resultado.comprobantes[filaSeleccionada]
    setEditForm({
      nombre: doc?.nombre || '',
      direccion: doc?.direccion || '',
      documento:
        doc?.dni && doc?.dni !== '0' && doc?.dni.length === 8
          ? doc.dni
          : doc?.ruc && doc?.ruc !== '0' && doc?.ruc.length === 11
          ? doc.ruc
          : '',
    })
    abrirModal('editar', doc)
  }

  // Manejar cambios en los campos del modal de edición
  const handleEditData = (e) => {
    const { name, value } = e.target
    if (name === "documento") {
      // Determinar el tipo de documento original
      const tieneRuc = datosSeleccion?.ruc && datosSeleccion.ruc !== '0';
      const tieneDni = datosSeleccion?.dni && datosSeleccion.dni !== '0';
      
      if (tieneRuc) {
        // Si originalmente era RUC, solo permitir 11 dígitos
        if (value.length > 11) return;
      } else if (tieneDni) {
        // Si originalmente era DNI, solo permitir 8 dígitos
        if (value.length > 8) return;
      }
    }
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  // Función que se ejecuta al guardar
  const handleEditSave = (e) => {
    e.preventDefault()
    // Aquí puedes hacer una petición a la API si lo deseas
    // Por ahora solo actualiza el estado local para mostrar el cambio
    setDatosSeleccion((prev) => ({
      ...prev,
      nombre: editForm.nombre,
      direccion: editForm.direccion,
      dni: editForm.documento.length === 8 ? editForm.documento : prev?.dni,
      ruc: editForm.documento.length === 11 ? editForm.documento : prev?.ruc,
    }))
    // Aquí puedes ejecutar cualquier función adicional que desees
    // Por ejemplo:
    // actualizarComprobanteEnBackend(editForm)
    cerrarModal()
  }


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

  // Nuevo handler para guardar edición de comprobante
  const handleEditModal = async (e) => {
    e.preventDefault();
    if (!datosSeleccion) return;

    // Determinar el tipo de documento original
    const tieneRuc = datosSeleccion?.ruc && datosSeleccion.ruc !== '0';
    const tieneDni = datosSeleccion?.dni && datosSeleccion.dni !== '0';

    // Validar que se mantenga el mismo tipo de documento con la longitud correcta
    if (tieneRuc && editForm.documento.length !== 11) {
      alert("El RUC debe tener exactamente 11 dígitos");
      return;
    }
    if (tieneDni && editForm.documento.length !== 8) {
      alert("El DNI debe tener exactamente 8 dígitos");
      return;
    }

    const id = datosSeleccion.id;
    const updateData = {
      nombre: editForm.nombre,
      direccion: editForm.direccion,
      dni: tieneDni ? editForm.documento : datosSeleccion.dni,
      ruc: tieneRuc ? editForm.documento : datosSeleccion.ruc,
    };
    try {
      await axios.put(`${urlUri}/api/comprobantes/${id}`, updateData);
      // Actualiza el estado local para reflejar el cambio en la tabla
      setResultado((prev) => ({
        ...prev,
        comprobantes: prev.comprobantes.map((c) =>
          c.id === id ? { ...c, ...updateData } : c
        ),
      }));
      setDatosSeleccion((prev) => ({ ...prev, ...updateData }));
      cerrarModal();
      navigate(0)
    } catch (error) {
      console.error('Error al actualizar comprobante:', error);
    }
  }

  const handlePrint = async () => {
    setLoadingPDF(true)
    try {
      const url = `${urlUri}/api/pdf/generar-pdf/${printNum}`
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      iframe.src = blobUrl
      document.body.appendChild(iframe)
      iframe.onload = () => {
        setLoadingPDF(false)
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        showToast("🖨️ Imprimiendo...")
      }
    } catch (error) {
      console.error("❌ Error al imprimir PDF:", error)
      showToast("❌ Error al imprimir PDF")
    }
  }

  const handleExtraFunction = () => {
    abrirModal("anular", resultado.comprobantes[filaSeleccionada])
  }

  const ponerDatos = async (input) => {
    const valor = typeof input === "string" ? input.trim() : input?.target?.value.trim()
    if (!valor) return
    setPrintNum(valor)
    try {
      setLoading(true)
      const response = await axios.get(`${urlUri}/api/reporte-diario/ingresos/${valor}`)
      const { reporte, comprobantes } = response.data

      setResultado({
        id: reporte._id,
        fecha: reporte.fecha.split("T")[0],
        total: reporte.total,
        comprobantes: comprobantes.map((c) => ({
          id: c._id,
          nombre: c.nombre,
          anulado: c.anulado,
          serie: c.serie,
          dni: c.dni,
          ruc: c.ruc,
          direccion: c.direccion || "",
          igv: c.igv || "N",
        })),
      })

      setTotales({ debe: reporte.total || 0, haber: reporte.total || 0 })
    } catch (err) {
      console.error("❌ Error al consultar el recibo:", err)
      setResultado({
        id: "",
        fecha: "",
        total: 0,
        comprobantes: [],
      })
      setTotales({ debe: 0, haber: 0 })
    } finally {
      setLoading(false)
    }
  }

  const ponerDatos2 = async (id) => {
    if (!id) return
    try {
      const response = await axios.get(`${urlUri}/api/reporte-diario/ingresos/${id}`)
      const { reporte, comprobantes } = response.data

      setResultado({
        id: reporte._id,
        fecha: reporte.fecha.split("T")[0],
        total: reporte.total,
        comprobantes: comprobantes.map((c) => ({
          id: c._id,
          nombre: c.nombre,
          anulado: c.anulado,
          serie: c.serie,
          dni: c.dni,
          ruc: c.ruc,
          direccion: c.direccion || "",
          igv: c.igv || "N",
        })),
      })

      setTotales({ debe: reporte.total || 0, haber: reporte.total || 0 })
    } catch (err) {
      console.error("Error al consultar el recibo", err)
    }
  }

  const cargarUltimoRIC = async () => {
    try {
      const response = await axios.get(`${urlUri}/api/reporte-diario/reportes/ultimo`)
      const ultimoID = response.data?._id || ""
      setPrintNum(ultimoID)
      if (ultimoID) {
        setFormData((prev) => ({
          ...prev,
          ultimoRIC: ultimoID,
          numeroRecibo: ultimoID,
        }))
        ponerDatos2(ultimoID)
        setNuevoRecibo(ultimoID)
      }
    } catch (error) {
      console.log("Error al obtener último RIC:", error)
    }
  }

  useEffect(() => {
    cargarUltimoRIC()
  }, [])

  return (
    <div className="h-full flex flex-col p-2 space-y-2">
      <ConfirmModal
        isOpen={modalNuevoRecibo}
        onClose={() => setModalNuevoRecibo(false)}
        onConfirm={handleConfirmar}
        message="¿Estas seguro de crear un nuevo recibo?"
      />


      {loadingPDF && (
        <div className="fixed  inset-0 h-full w-full z-100 flex justify-center items-center bg-black/10 flex-col gap-4">
          <div className="flex justify-center items-center ">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 class="text-2xl text-blue-500 font-bold hover:[--tw-animate-bounce-text_restart:restart]">
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">C</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">a</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">r</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">g</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">a</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">n</span>
            <span class="inline-block animate-bounce [animation-delay:-0.1s]">d</span>
            <span class="inline-block animate-bounce [animation-delay:-0.2s]">o</span>
          </h1>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0 border border-gray-200 p-5">
        {/* Encabezado: Título y Controles de Recibo */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-[5px]">

          <div className="flex items-center gap-3">
            <img
              src="/icon/Escudo.png"
              className="w-8 h-8 sm:w-12 sm:h-12 transition-transform hover:scale-105"
              alt="Escudo"
            />
            <h2 className="text-lg font-bold text-gray-800">Recaudación</h2>
          </div>



          <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3 items-center">
            <div className="flex items-center space-x-1">
              <label className="text-xs font-medium text-gray-700">N° Recibo</label>
              <input
                type="text"
                name="numeroRecibo"
                value={formData.numeroRecibo}
                onChange={(e) => {
                  handleInputChange(e)
                  ponerDatos(e)
                }}
                className="text-base font-bold text-blue-600 border border-blue-300 rounded px-2 py-1 w-24 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-xs font-medium text-gray-700">Último R.I.C.</label>
              <input
                type="text"
                name="ultimoRIC"
                value={formData.ultimoRIC}
                readOnly
                className="text-base font-bold text-blue-600 border border-gray-300 rounded px-2 py-1 w-16 text-center bg-gray-50"
              />
            </div>
            {loading && (
              <div className="flex items-center">
                <div className="spinner w-4 h-4 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Campos de Formulario (Compacta) */}
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-x-4 gap-y-2 text-xs">
            {/* Fila 1 */}
            <div className="flex items-center space-x-1">
              <label className="font-medium text-gray-700 min-w-[40px]">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={resultado.fecha ?? ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="font-medium text-gray-700 min-w-[40px]">Sector</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                readOnly
                className="border border-gray-300 rounded px-1 py-0.5 w-full bg-gray-50 text-gray-600"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="font-medium text-gray-700 min-w-[40px]">Acción</label>
              <input
                type="text"
                name="accion"
                value={formData.accion}
                readOnly
                className="border border-gray-300 rounded px-1 py-0.5 w-full bg-gray-50 text-gray-600"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="font-medium text-gray-700 min-w-[40px]">Fte.Fto </label>
              <input
                type="text"
                name="fuenteFinanciamiento"
                value={formData.fuenteFinanciamiento}
                readOnly
                className="border border-gray-300 rounded px-1 py-0.5 w-full bg-gray-50 text-gray-600"
              />
            </div>

            {/* Fila 2 */}
            <div className="flex items-center space-x-1">
              <label className="font-medium text-gray-700 min-w-[40px]">Cta.Cte</label>
              <input
                type="text"
                name="cuentaCorriente"
                value={formData.cuentaCorriente}
                readOnly
                className="border border-gray-300 rounded px-1 py-0.5 w-full bg-gray-50 text-gray-600"
              />
            </div>
            <div className="flex items-center space-x-1">
            </div>
          </div>
          {/* Totales - Alineado a la derecha en la última columna */}
          <div className=" flex items-center justify-end space-x-4 col-span-full xl:col-span-1 xl:justify-self-end">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600">Debe (RIC)</span>
              <div className="font-bold text-sm text-green-600">S/ {totales.debe.toFixed(2)}</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600">Haber (HDB)</span>
              <div className="font-bold text-sm text-green-600">S/ {totales.haber.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Sección de la Tabla de Documentos (Prioritaria) */}
        <div className="flex-1 overflow-hidden flex flex-col p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Comprobantes Registrados</h3>
            <div className="flex gap-2.5">
              <button
                onClick={handleAddCuenta}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-1 rounded shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-1"
                title="Agregar documento"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M12 13V17M14 15H10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline text-xs">Agregar</span>
              </button>
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-1 rounded shadow-sm hover:shadow transition-all duration-200"
                title="Imprimir"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 18H6.2C5.0799 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V10.2C3 9.0799 3 8.51984 3.21799 8.09202C3.40973 7.71569 3.71569 7.40973 4.09202 7.21799C4.51984 7 5.0799 7 6.2 7H7M17 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V10.2C21 9.07989 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H17M7 11H7.01M17 7V5.4V4.6C17 4.03995 17 3.75992 16.891 3.54601C16.7951 3.35785 16.6422 3.20487 16.454 3.10899C16.2401 3 15.9601 3 15.4 3H8.6C8.03995 3 7.75992 3 7.54601 3.10899C7.35785 3.20487 7.20487 3.35785 7.10899 3.54601C7 3.75992 7 4.03995 7 4.6V5.4V7M17 7H7M8.6 21H15.4C15.9601 21 16.2401 21 16.454 20.891C16.6422 20.7951 16.7951 20.6422 16.891 20.454C17 20.2401 17 19.9601 17 19.4V16.6C17 16.0399 17 15.7599 16.891 15.546C16.7951 15.3578 16.6422 15.2049 16.454 15.109C16.2401 15 15.9601 15 15.4 15H8.6C8.03995 15 7.75992 15 7.54601 15.109C7.35785 15.2049 7.20487 15.3578 7.10899 15.546C7 15.7599 7 16.0399 7 16.6V19.4C7 19.9601 7 20.2401 7.10899 20.454C7.20487 20.6422 7.35785 20.7951 7.54601 20.891C7.75992 21 8.03995 21 8.6 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={handleNewReceipt}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-1 rounded shadow-sm hover:shadow transition-all duration-200"
                title="Nuevo recibo"
              >
                <svg className="w-6 h-6" viewBox="-4 0 34 34" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fillRule="evenodd">
                    <g>
                      <path
                        d="M1 1.993c0-.55.45-.993.995-.993h17.01c.55 0 1.34.275 1.776.625l3.44 2.75c.43.345.78 1.065.78 1.622v26.006c0 .55-.447.997-1 .997H2c-.552 0-1-.452-1-.993V1.993z"
                        stroke="currentColor"
                        strokeWidth="2.4"
                      />
                      <path fill="currentColor" d="M18 2h1v6h-1z" />
                      <path fill="currentColor" d="M18 7h6v1h-6z" />
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <div className="h-full overflow-y-auto">
              <table className="min-w-full text-xs border-collapse bg-white">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100  top-0">
                  <tr>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">TD</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">Serie</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">Nro</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">IGV</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">RUC</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">DNI</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">Nombre</th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">
                      Dirección
                    </th>
                    <th className="px-1 py-1 border-b border-blue-200 font-semibold text-blue-800 text-left">
                      Anulado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.comprobantes?.map((doc, index) => (
                    <tr
                      key={doc.id || index}
                      className={`hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${filaSeleccionada === index
                        ? "bg-blue-100 border-l-2 border-blue-500"
                        : "border-b border-gray-100"
                        }`}
                      onClick={() => {
                        setFilaSeleccionada((prev) => (prev === index ? null : index))
                        setDatosSeleccion(doc)
                      }}
                    >
                      <td className="px-1 py-0.5">CC</td>
                      <td className="px-1 py-0.5">00{doc.serie}</td>
                      <td className="px-1 py-0.5">0{doc.id}</td>
                      <td className="px-1 py-0.5">{doc.igv}</td>
                      <td className="px-1 py-0.5">{doc.ruc}</td>
                      <td className="px-1 py-0.5">{doc.dni}</td>
                      <td className="px-1 py-0.5 text-left">{doc.nombre}</td>
                      <td className="px-1 py-0.5 text-left">{doc.direccion || "No registrado"}</td>
                      <td className="px-1 py-0.5">
                        <span
                          className={`px-1 py-0.5 rounded-full text-xs ${doc.anulado ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                        >
                          {doc.anulado ? "Sí" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer: Botones de Acción y Total */}
        <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {filaSeleccionada !== null && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm hover:shadow transition-all duration-200"
                  >
                    EDITAR
                  </button>
                  <button
                    onClick={handleExtraFunction}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm hover:shadow transition-all duration-200"
                  >
                    ANULAR
                  </button>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Retención: S/ 0.00</div>
              <div className="font-bold text-base text-green-600">
                Total: S/ {resultado.total?.toFixed(2) ?? "0.00"}
              </div>
            </div>
          </div>
        </div>

        {/* Modales (sin cambios de lógica, solo estilos compactos) */}
        <GenericModal isOpen={modalOpen} onClose={cerrarModal}>
          {modalType === "editar" && (
            <>
              <h2 className="text-lg font-bold mb-3 text-gray-800">Editar Comprobante</h2>
              <div className="p-3 bg-white rounded-lg">
                <form onSubmit={handleEditModal} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nro</label>
                      <input
                        type="text"
                        readOnly
                        value={datosSeleccion?.id || ""}
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={editForm.nombre}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleEditData}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Documento</label>
                    <input
                      type="text"
                      name="documento"
                      value={editForm.documento}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleEditData}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={editForm.direccion}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleEditData}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cerrarModal}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
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
              <h2 className="text-lg font-bold mb-3 text-gray-800">Confirmar Anulación</h2>
              <div className="p-3 bg-white rounded-lg text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm">¿Desea anular este registro?</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow">
                    Aceptar
                  </button>
                  <button
                    onClick={cerrarModal}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </>
          )}

          {modalType === "cuenta" && (
            <>
              <h2 className="text-lg font-bold mb-3 text-gray-800">Agregar Registro</h2>
              <div className="p-3 bg-white rounded-lg">
                <form className="space-y-3" onSubmit={handleContinuar}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tipo Doc</label>
                      <input
                        type="text"
                        value="03 Comprobate de caja"
                        readOnly
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Serie</label>
                      <input
                        type="text"
                        readOnly
                        value={4}
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nro</label>
                      <input
                        type="text"
                        readOnly
                        value={ultimoRegistro || ""}
                        className="w-full border border-gray-300 rounded p-1.5 text-xs bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={datosRegistro.nombre}
                      name="nombre"
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo Documento *</label>
                    <select
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-1"
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
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      name="numeroDocumento"
                      required
                      value={datosRegistro.numeroDocumento}
                      onChange={handleChange}
                      placeholder="Ingrese el número de documento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      name="direccion"
                      value={datosRegistro.direccion}
                      onChange={handleChange}
                      placeholder="Ingrese la dirección"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
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
