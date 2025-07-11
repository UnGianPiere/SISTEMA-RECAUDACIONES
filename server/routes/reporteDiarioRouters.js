const express = require('express');
const router = express.Router();
const {crearReporte,obtenerReportes,obtenerReportePorId,obtenerReportePorIdconIngresos,obtenerUltimoReporte,actualizarReporte,actSumaReporte,actRestaReporte} = require('../controllers/reporteDiarioController');

//PUT actualizar el reporte
router.put('/:id',actualizarReporte);

router.put('/suma/:id',actSumaReporte)

router.put('/resta/:id',actRestaReporte)

// POST /api/reportes
router.post('/', crearReporte);

// GET /api/reportes
router.get('/', obtenerReportes);

// Get ultimo reporte
router.get('/reportes/ultimo',obtenerUltimoReporte)

// GET /api/reportes/ingresos/:id
router.get('/ingresos/:id', obtenerReportePorIdconIngresos);

// GET /api/reportes/:id
router.get('/:id', obtenerReportePorId);


module.exports = router;
