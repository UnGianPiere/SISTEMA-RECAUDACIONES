const ClasificacionIngreso = require('../models/ClasificacionIngreso');

// Obtener todos los registros
exports.getAll = async (req, res) => {
    try {
        const datos = await ClasificacionIngreso.find();
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los datos', error });
    }
};

// Obtener uno por código
exports.getByCodigo = async (req, res) => {
    try {
        const registro = await ClasificacionIngreso.findOne({ codigo: req.params.codigo });
        if (!registro) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        res.status(200).json(registro);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el código', error });
    }
};

// Crear nuevo registro
exports.create = async (req, res) => {
    try {
        const nuevo = new ClasificacionIngreso(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el registro', error });
    }
};

// Actualizar por código
exports.update = async (req, res) => {
    try {
        const actualizado = await ClasificacionIngreso.findOneAndUpdate(
            { codigo: req.params.codigo },
            req.body,
            { new: true }
        );
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        res.status(200).json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar', error });
    }
};

// Eliminar por código
exports.remove = async (req, res) => {
    try {
        const eliminado = await ClasificacionIngreso.findOneAndDelete({ codigo: req.params.codigo });
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Registro no encontrado para eliminar' });
        }
        res.status(200).json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error });
    }
};
