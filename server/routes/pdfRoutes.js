const express = require('express');
const router = express.Router();
const { generarPDF,generarPDFMensual,generarPDFMensual2,generarPDFMensual3,generarPDFMensual4,generarPDFMensual5,generarPDFComprobanteCaja,generarPDFAnual} = require('../controllers/pdfController');

// Ruta para generar y mostrar PDF
router.get('/generar-pdf/:id', generarPDF);
router.get('/generar-pdf-reporte-anual/:anio', generarPDFAnual);
router.post('/generar-pdf-comprobante-caja/', generarPDFComprobanteCaja); // Ruta para generar PDF mensual de documento anulado
router.get('/generar-pdf-mensual-recaudacion/:anio/:mes', generarPDFMensual); // Ruta para generar PDF mensual de recaudacion de ingresos
router.get('/generar-pdf-mensual-ingresos/:anio/:mes', generarPDFMensual2); // Ruta para generar PDF mensual de ingresos
router.get('/generar-pdf-mensual-hoja-trabajo/:anio/:mes', generarPDFMensual3); // Ruta para generar PDF mensual de hoja de trabajo
router.get('/generar-pdf-mensual-doc-emitido/:anio/:mes', generarPDFMensual4); // Ruta para generar PDF mensual de documento emitido
router.get('/generar-pdf-mensual-doc-anulado/:anio/:mes', generarPDFMensual5); // Ruta para generar PDF mensual de documento anulado

module.exports = router;
