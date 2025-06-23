const express = require('express');
const router = express.Router();
const { crearTupa, obtenerTupas } = require('../controllers/tupaController');

// POST: Crear nuevo TUPA
router.post('/', crearTupa);

// GET: Obtener todos los TUPAs
router.get('/', obtenerTupas);

module.exports = router;
