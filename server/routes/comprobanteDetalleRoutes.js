const express = require('express');
const router = express.Router();
const controlador = require('../controllers/comprobanteDetalleController');

// Rutas específicas primero
router.get('/ingreso/:id', controlador.obtenerDetallesPorIngreso);

// General
router.post('/', controlador.crearDetalle);
router.get('/', controlador.obtenerDetalles);
router.get('/:id', controlador.obtenerDetallePorId);
router.put('/:id', controlador.actualizarDetalle);
router.delete('/:id', controlador.eliminarDetalle);

module.exports = router;
