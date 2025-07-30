const ReporteDiario = require('../models/ReporteDiario');
const ComprobanteIngreso = require('../models/ComprobanteIngreso');
const ComprobanteDetalle = require('../models/ComprobanteDetalle');

const crearReporte = async (req, res) => {
  try {

    const fechaUTC = new Date(); // ← hora actual del servidor (probablemente UTC o local)
    const offsetLima = -5 * 60; // UTC-5 en minutos
    const fechaPeru = new Date(fechaUTC.getTime() + offsetLima * 60000);
    const reporteData = {
      ...req.body,
      fecha: fechaPeru,
    }
    const nuevoReporte = new ReporteDiario(reporteData);
    const guardado = await nuevoReporte.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(400).json({ error: 'Error al crear reporte', detalles: error.message });
  }
};

//Actualiza cualquier parte o todo el reporte diario
const actualizarReporte = async (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  try {
    const actulizar = await ReporteDiario.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true
    })
    res.status(200).json(actulizar)
  } catch (error) {
    console.error(`Error al actualizar : ${error}`)
  }
}

//Actuliza el apartado del monto sumando el nuevo ingreso
const actSumaReporte = async (req, res) => {
  const id = req.params.id;
  const { monto } = req.body;
  console.log(monto);
  try {
    const actulizar = await ReporteDiario.findByIdAndUpdate(id)
    if (!actulizar) {
      return res.status(404).json({ message: "no encontrado" })
    }
    actulizar.total += Number(monto)
    await actulizar.save()
    res.status(200).json(actulizar)
  } catch (error) {
    console.error(`Error al actualizar : ${error}`)
  }
}

//Actualiza el apartado del monto restando el nuevo ingreso
const actRestaReporte = async (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  try {
    const actulizar = await ReporteDiario.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true
    })
    res.status(200).json(actulizar)
  } catch (error) {
    console.error(`Error al actualizar : ${error}`)
  }
}



// Obtener todos los reportes
const obtenerReportes = async (req, res) => {
  try {
    const reportes = await ReporteDiario.find().sort({ fecha: -1 });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

const obtenerUltimoReporte = async (req, res) => {
  const año = req.params.año;

  try {
    const [ultimo] = await ReporteDiario.aggregate([
      {
        $addFields: {
          correlativo: {
            $toInt: { $arrayElemAt: [{ $split: ["$_id", "-"] }, 0] }
          },
          anioExtraido: {
            $arrayElemAt: [{ $split: ["$_id", "-"] }, 1]
          }
        }
      },
      {
        $match: { anioExtraido: año }
      },
      {
        $sort: { correlativo: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (!ultimo) {
      return res.status(404).json({ error: `No hay reportes para el año ${año}` });
    }

    res.json(ultimo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reporte', detalles: error.message });
  }
};


// Obtener un reporte por ID
const obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await ReporteDiario.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'No encontrado' });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reporte' });
  }
};


const datosPDF = async (id) => {
  if (!id || typeof id !== 'string' || !id.includes('-')) {
    throw new Error('ID inválido');
  }

  const reporte = await ReporteDiario.findOne({ _id: id });
  if (!reporte) throw new Error('Reporte no encontrado');

  const comprobantes = await ComprobanteIngreso.find({ numeroregistro: id });
  const idsComprobantes = comprobantes.map(c => c._id);
  const detalles = await ComprobanteDetalle.find({ ingresoId: { $in: idsComprobantes } });

  const comprobantesConDetalles = comprobantes.map(comp => {
    const detallesAsociados = detalles.filter(det => String(det.ingresoId) === String(comp._id));
    return {
      ...comp.toObject(),
      detalles: detallesAsociados,
    };
  });

  return { reporte, comprobantes: comprobantesConDetalles };
};
//  Controlador HTTP que usa la función reutilizable
const obtenerReportePorIdconIngresos = async (req, res) => {
  try {
    const id = (req.params.id);
    const datos = await datosPDF(id);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el reporte e ingresos', detalles: error.message });
  }
};

// Exportar todo
module.exports = {
  crearReporte,
  obtenerReportes,
  obtenerUltimoReporte,
  obtenerReportePorId,
  obtenerReportePorIdconIngresos,
  datosPDF, // para ser usado en otros controladores como generarPDF
  actualizarReporte,
  actSumaReporte, //suma un nuevo valor al monto acumulado del reporte
  actRestaReporte //resta un monto al monto acumulado del reporte
};
