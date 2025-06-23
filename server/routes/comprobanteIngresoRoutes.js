const express = require('express');
const router = express.Router();
const controller = require('../controllers/comprobanteIngresoController');

// POST nuevo
router.post('/', controller.createComprobante);

// GET todos
router.get('/', controller.getAllComprobantes);

// GET uno por ID
router.get('/:id', controller.getComprobanteById);

// PUT actualizar
router.put('/:id', controller.updateComprobante);

// DELETE
router.delete('/:id', controller.deleteComprobante);

module.exports = router;
