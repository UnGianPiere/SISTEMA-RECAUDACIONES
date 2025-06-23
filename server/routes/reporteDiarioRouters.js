const express = require('express');
const router = express.Router();
const controller = require('../controllers/reporteDiarioController');

// POST /api/reportes
router.post('/', controller.crearReporte);

// GET /api/reportes
router.get('/', controller.obtenerReportes);

// GET /api/reportes/:id
router.get('/:id', controller.obtenerReportePorId);

// GET /api/reportes/ingresos/:id
router.get('/ingresos/:id', controller.obtenerReportePorIdconIngresos);

module.exports = router;
