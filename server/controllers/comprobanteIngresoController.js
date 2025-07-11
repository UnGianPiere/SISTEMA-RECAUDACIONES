const ComprobanteIngreso = require('../models/ComprobanteIngreso');
const ComprobanteDetalle = require('../models/ComprobanteDetalle');
// Crear comprobante
exports.createComprobante = async (req, res) => {
    try {
        const nuevo = new ComprobanteIngreso(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//Crear comprobante con detalles a la vez
exports.crearComprobanteConDetalles = async (req, res) => {
    const { comprobante, detalles } = req.body;

    try {
        const nuevoComprobante = new ComprobanteIngreso(comprobante);
        await nuevoComprobante.save();

        const detallesDocs = detalles.map(item => new ComprobanteDetalle(item));
        await ComprobanteDetalle.insertMany(detallesDocs);

        res.status(201).json({ message: "Guardado correctamente." });
    } catch (error) {
        console.error("❌ Error al guardar comprobante con detalles:", error);
        res.status(500).json({ error: "No se pudo guardar." });
    }
};



// Obtener todos
exports.getAllComprobantes = async (req, res) => {
    try {
        const lista = await ComprobanteIngreso.find().sort({ createdAt: -1 });
        res.json(lista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Obtener el último comprobante
exports.getUltimoComprobante = async (req, res) => {
    try {
        const ultimo = await ComprobanteIngreso.findOne().sort({ _id: -1 });
        if (!ultimo) return res.status(404).json({ error: 'No hay comprobantes' });
        res.json(ultimo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Obtener por ID
exports.getComprobanteById = async (req, res) => {
    try {
        const comp = await ComprobanteIngreso.findById(req.params.id);
        if (!comp) return res.status(404).json({ error: 'No encontrado' });
        res.json(comp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar
exports.updateComprobante = async (req, res) => {
    try {
        const actualizado = await ComprobanteIngreso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar
exports.deleteComprobante = async (req, res) => {
    try {
        const eliminado = await ComprobanteIngreso.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
        res.json({ mensaje: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
