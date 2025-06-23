const express = require('express');
const router = express.Router();
const { crearCuenta, obtenerCuentas } = require('../controllers/cuentasRecaudoController');

// POST: Crear cuenta
router.post('/', crearCuenta);

// GET: Obtener todas las cuentas
router.get('/', obtenerCuentas);

module.exports = router;
