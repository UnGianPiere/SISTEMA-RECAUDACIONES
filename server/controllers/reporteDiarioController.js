const ReporteDiario = require('../models/ReporteDiario');
const ComprobanteIngreso = require('../models/ComprobanteIngreso');
const ComprobanteDetalle = require('../models/ComprobanteDetalle');


// Crear nuevo reporte
exports.crearReporte = async (req, res) => {
    try {
        const nuevoReporte = new ReporteDiario(req.body);
        const guardado = await nuevoReporte.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear reporte', detalles: error });
    }
};

// Obtener todos los reportes
exports.obtenerReportes = async (req, res) => {
    try {
        const reportes = await ReporteDiario.find().sort({ fecha: -1 });
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
};

// Obtener un reporte por ID
exports.obtenerReportePorId = async (req, res) => {
    try {
        const reporte = await ReporteDiario.findById(req.params.id);
        if (!reporte) return res.status(404).json({ error: 'No encontrado' });
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar reporte' });
    }
};


// Obtener un reporte por ID y sus comprobantes de ingreso relacionados
exports.obtenerReportePorIdconIngresos = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        const reporte = await ReporteDiario.findById(id);
        if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });

        // 1. Buscar comprobantes asociados al reporte
        const comprobantes = await ComprobanteIngreso.find({ numeroregistro: id });

        // 2. Obtener los detalles de todos los comprobantes
        const idsComprobantes = comprobantes.map(c => c._id);
        const detalles = await ComprobanteDetalle.find({ ingresoId: { $in: idsComprobantes } });

        // 3. Agrupar los detalles dentro de sus comprobantes
        const comprobantesConDetalles = comprobantes.map(comp => {
            const detallesAsociados = detalles.filter(det => String(det.ingresoId) === String(comp._id));
            return {
                ...comp.toObject(),
                detalles: detallesAsociados
            };
        });

        res.json({ reporte, comprobantes: comprobantesConDetalles });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el reporte e ingresos', detalles: error.message });
    }
};
