const Tupa = require('../models/Tupa');

// Crear TUPA
exports.crearTupa = async (req, res) => {
    try {
        const nuevoTupa = new Tupa(req.body);
        await nuevoTupa.save();
        res.status(201).json(nuevoTupa);
    } catch (err) {
        console.error('❌ Error al crear TUPA:', err);
        res.status(400).json({ error: 'Error al crear TUPA' });
    }
};

// Obtener todos los TUPAs
exports.obtenerTupas = async (req, res) => {
    try {
        const registros = await Tupa.find();
        res.json(registros);
    } catch (err) {
        console.error('❌ Error al obtener TUPAs:', err);
        res.status(500).json({ error: 'Error al obtener TUPAs' });
    }
};
