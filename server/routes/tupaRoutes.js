const express = require('express');
const router = express.Router();
const { crearTupa, obtenerTupas, obtenerTupasPorId, actualizarTupa } = require('../controllers/tupaController');

// POST: Crear nuevo TUPA
router.post('/', crearTupa);

// GET: Obtener todos los TUPAs
router.get('/', obtenerTupas);

router.get('/:id',obtenerTupasPorId)

router.put('/:id',actualizarTupa)

module.exports = router;
