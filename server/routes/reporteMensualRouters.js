const {obtenerReporteMensual,obtenerReporteMensual2} = require('../controllers/reporteMensualController');
const express = require('express');
const router = express.Router();

router.get('/reporte/:anio/:mes', obtenerReporteMensual);
router.get('/reporte-avanzado/:anio/:mes', obtenerReporteMensual2);
module.exports = router;