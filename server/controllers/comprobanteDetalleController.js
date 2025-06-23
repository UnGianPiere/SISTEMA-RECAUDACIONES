const ComprobanteDetalle = require('../models/ComprobanteDetalle');

exports.crearDetalle = async (req, res) => {
    try {
        const nuevoDetalle = new ComprobanteDetalle(req.body);
        await nuevoDetalle.save();
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear detalle', detalle: error.message });
    }
};

exports.obtenerDetalles = async (req, res) => {
    try {
        const detalles = await ComprobanteDetalle.find().populate('tupaId').populate('ingresoId');
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles', detalle: error.message });
    }
};

exports.obtenerDetallePorId = async (req, res) => {
    try {
        const detalle = await ComprobanteDetalle.findById(req.params.id).populate('tupaId').populate('ingresoId');
        if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar detalle', detalle: error.message });
    }
};

exports.actualizarDetalle = async (req, res) => {
    try {
        const actualizado = await ComprobanteDetalle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ error: 'Detalle no encontrado' });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar detalle', detalle: error.message });
    }
};

exports.eliminarDetalle = async (req, res) => {
    try {
        const eliminado = await ComprobanteDetalle.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Detalle no encontrado' });
        res.json({ mensaje: 'Detalle eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar detalle', detalle: error.message });
    }
};


// Obtener detalles por ingresoId
exports.obtenerDetallesPorIngreso = async (req, res) => {
    try {
        const ingresoId = parseInt(req.params.id);
        const detalles = await ComprobanteDetalle.find({ ingresoId })
            .populate('ingresoId');
        res.json(detalles);
    } catch (err) {
        console.error("Error al obtener detalles:", err);
        res.status(500).json({ error: 'Error al obtener los detalles' });
    }
};
