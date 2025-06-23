const express = require('express');
const router = express.Router();
const clasificacionController = require('../controllers/clasificacionIngresoController');

// GET todos
router.get('/', clasificacionController.getAll);

// GET uno por código
router.get('/:codigo', clasificacionController.getByCodigo);

// POST nuevo
router.post('/', clasificacionController.create);

// PUT actualizar por código
router.put('/:codigo', clasificacionController.update);

// DELETE eliminar por código
router.delete('/:codigo', clasificacionController.remove);

module.exports = router;
