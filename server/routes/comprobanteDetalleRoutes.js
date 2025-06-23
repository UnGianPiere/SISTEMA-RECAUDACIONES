const express = require('express');
const router = express.Router();
const controlador = require('../controllers/comprobanteDetalleController');

router.post('/', controlador.crearDetalle);
router.get('/', controlador.obtenerDetalles);
router.get('/:id', controlador.obtenerDetallePorId);
router.put('/:id', controlador.actualizarDetalle);
router.delete('/:id', controlador.eliminarDetalle);
router.get('/ingreso/:id', controlador.obtenerDetallesPorIngreso);

module.exports = router;
