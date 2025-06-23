const CuentaRecaudo = require('../models/CuentaRecaudo');

// Crear una nueva cuenta
exports.crearCuenta = async (req, res) => {
    try {
        const nuevaCuenta = new CuentaRecaudo(req.body);
        await nuevaCuenta.save();
        res.status(201).json(nuevaCuenta);
    } catch (err) {
        console.error('❌ Error al crear cuenta:', err);
        res.status(400).json({ error: 'Error al crear cuenta' });
    }
};

// Obtener todas las cuentas
exports.obtenerCuentas = async (req, res) => {
    try {
        const cuentas = await CuentaRecaudo.find();
        res.json(cuentas);
    } catch (err) {
        console.error('❌ Error al obtener cuentas:', err);
        res.status(500).json({ error: 'Error al obtener cuentas' });
    }
};
