const express = require('express');
const router = express.Router();
const controller = require('../controllers/comprobanteIngresoController');


//Anular comprobante ingreso
router.put('/anular/:id', controller.anularComprobante)

// POST nuevo
router.post('/', controller.createComprobante);

// GET todos
router.get('/', controller.getAllComprobantes);

// POST crear comprobante con detalles
router.post('/crear', controller.crearComprobanteConDetalles);

//GET el ultimo numero de comprobante
router.get('/ultimo', controller.getUltimoComprobante);

//GET uno por ID con detalle
router.get('/detalles/:id', controller.getComprobanteByIdConDetalles);

// GET uno por ID
router.get('/:id', controller.getComprobanteById);

// PUT actualizar
router.put('/:id', controller.updateComprobante);

// DELETE
router.delete('/:id', controller.deleteComprobante);

module.exports = router;
