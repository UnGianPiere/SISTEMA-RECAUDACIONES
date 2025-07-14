const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const { numeroALetras } = require('../utils/numeroALetras');
const { datosPDF } = require('./reporteDiarioController');
const { datosPDFMensual, obtenerDatosReporteMensual, obtenerDatosReporteMensual2 } = require('./reporteMensualController');
//genera un PDF para reporte diario
const generarPDF = async (req, res) => {
    let browser; // ✅ Declaración global para try/catch/finally

    try {
        const id = parseInt(req.params.id);

        const { reporte, comprobantes } = await datosPDF(id);

        const letras = numeroALetras(reporte.total);

        const fechaObj = new Date(reporte.fecha);
        const dia = fechaObj.getUTCDate().toString().padStart(2, '0');
        const mes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
        const anio = fechaObj.getUTCFullYear();
        const importe = reporte.total;

        const recibos = comprobantes.map(comp => {
            const codigo = `CC.${comp.serie.toString().padStart(3, '0')}-${comp._id.toString().padStart(6, '0')}`;
            const monto = comp.detalles.reduce((sum, det) => sum + (det.cantidad * det.importe), 0);
            return { codigo, monto };
        });

        const logoPath = path.join(__dirname, '../assets/Escudo.png');
        if (!fs.existsSync(logoPath)) {
            return res.status(404).json({ error: 'Logo no encontrado' });
        }
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');

        const ahora = new Date();
        const fechaNOW = ahora.toLocaleDateString('es-PE');
        const hora = ahora.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const datos = {
            fechaNOW,
            hora,
            numero: id,
            fecha: { dia, mes, anio },
            importe,
            logoBase64,
            recibos,
            numeroletrado: letras,
        };

        const templatePath = path.join(__dirname, '../views/reporteDiario.ejs');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // ✅ Asignar browser a variable global
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        res.status(500).json({
            error: 'Error interno al generar el PDF',
            details: error.message,
            stack: error.stack
        });
    } finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
};



//genera un PDF para reporte mensual de recudacion de ingresos
const generarPDFMensual = async (req, res) => {
    const { anio, mes } = req.params;
    let browser; 
    try {
        const sumaTotal = await datosPDFMensual(mes, anio);
        console.log('sumaTotal', sumaTotal);

        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        const fecha = { mes: meses[mes - 1], anio };

        const datos = {
            fecha,
            importe: sumaTotal.sumaTotal,
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/recaudacionMensual.ejs');

        if (!fs.existsSync(templatePath)) {
            console.error('❌ Plantilla no encontrada en:', templatePath);
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // === 3. Generar PDF con Puppeteer ===
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });


        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: true,
            margin: {
                bottom: '10mm',
                left: '10mm',
                right: '10mm',
            },
        });

        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);


    } catch (error) {
        console.error('❌ Error al generar PDF mensual:', error);
        res.status(500).json({ error: 'Error al generar PDF mensual', details: error.message, stack: error.stack });
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}


//genera un PDF para reporte mensual de ingresos por fuente de financiamiento
const generarPDFMensual2 = async (req, res) => {
    const { anio, mes } = req.params;
    let browser;
    try {
        const sumaTotal = await datosPDFMensual(mes, anio);
        console.log('sumaTotal', sumaTotal);

        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        const ahora = new Date();
        const fechaNOW = ahora.toLocaleDateString('es-PE');
        const hora = ahora.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });


        const fecha = { mes: meses[mes - 1], anio };
        const datos = {
            fecha,
            importe: sumaTotal.sumaTotal,
            fechaNOW,
            hora,
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/ingresoMensual.ejs');

        if (!fs.existsSync(templatePath)) {
            console.error('❌ Plantilla no encontrada en:', templatePath);
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // === 3. Generar PDF con Puppeteer ===
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });


        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: true,
            margin: {
                bottom: '10mm',
                left: '10mm',
                right: '10mm',
            },
        });
        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);


    } catch (error) {
        console.error('❌ Error al generar PDF mensual2:', error);
        res.status(500).json({ error: 'Error al generar PDF mensual2', details: error.message, stack: error.stack });
    }
    finally{
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}

const generarPDFMensual3 = async (req, res) => {
    let browser;
    const { anio, mes } = req.params;
    try {
        const sumaTotal = await datosPDFMensual(mes, anio);
        console.log('sumaTotal', sumaTotal);
        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        const fecha = { mes: meses[mes - 1], anio };

        const reportes = await obtenerDatosReporteMensual(anio, mes);

        const datos = {
            fecha,
            total: sumaTotal.sumaTotal, // total general como string
            reportes,
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/hojaTrabajo.ejs');

        if (!fs.existsSync(templatePath)) {
            console.error('❌ Plantilla no encontrada en:', templatePath);
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // === 3. Generar PDF con Puppeteer ===
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '10mm',
                right: '10mm',
            },
        });

        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);


    } catch (error) {
        console.error('❌ Error al generar PDF mensual3:', error);
        res.status(500).json({ error: 'Error al generar PDF mensual3', details: error.message, stack: error.stack });
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}

generarPDFMensual4 = async (req, res) => {
    const { anio, mes } = req.params;
    let browser;
    try {
        const data = await obtenerDatosReporteMensual2(anio, mes);
        const reportes = data.flatMap(reporte =>
            reporte.comprobantes.map(comprobante => {
                const monto = comprobante.detalles.reduce(
                    (acc, d) => acc + d.cantidad * d.importe, 0
                );

                return {
                    _id: comprobante._id,
                    serie: comprobante.serie,
                    nombre: comprobante.nombre,
                    anulado: comprobante.anulado,
                    numeroregistro: comprobante.numeroregistro,
                    monto,
                    fecha: new Date(reporte.fecha).toISOString().split('T')[0].split('-').reverse().join('/')
                };
            })
        );
        const total = reportes.reduce((acc, item) => acc + item.monto, 0);

        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        const ahora = new Date();
        const fechaActual = ahora.toLocaleDateString('es-PE'); // o 'es-ES'
        const horaActual = ahora.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 👈 Esto fuerza el formato de 24 horas
        });

        const fecha = { mes: meses[mes - 1], anio };

        const datos = {
            fecha,
            fechaActual,
            horaActual,
            pagina: 0,
            total,
            reportes,
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/documentosEmitidos.ejs');

        if (!fs.existsSync(templatePath)) {
            console.error('❌ Plantilla no encontrada en:', templatePath);
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // === 3. Generar PDF con Puppeteer ===
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });


        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
        });

        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);


    } catch (error) {
        console.error('❌ Error al generar PDF mensual4:', error);
        res.status(500).json({ error: 'Error al generar PDF mensual4', details: error.message, stack: error.stack });
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }

}

generarPDFMensual5 = async (req, res) => {
    const { anio, mes } = req.params;
    let browser;
    try {
        const data = await obtenerDatosReporteMensual2(anio, mes);
        const reportes = data.flatMap(reporte =>
            reporte.comprobantes.map(comprobante => {
                const monto = comprobante.detalles.reduce(
                    (acc, d) => acc + d.cantidad * d.importe, 0
                );

                return {
                    _id: comprobante._id,
                    serie: comprobante.serie,
                    nombre: comprobante.nombre,
                    anulado: comprobante.anulado,
                    numeroregistro: comprobante.numeroregistro,
                    monto,
                    fecha: new Date(reporte.fecha).toISOString().split('T')[0].split('-').reverse().join('/')
                };
            })
        );

        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        const ahora = new Date();
        const fechaActual = ahora.toLocaleDateString('es-PE'); // o 'es-ES'
        const horaActual = ahora.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 👈 Esto fuerza el formato de 24 horas
        });

        const fecha = { mes: meses[mes - 1], anio };

        const datos = {
            fecha,
            fechaActual,
            horaActual,
            pagina: 0,
            reportes,
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/documentosAnulados.ejs');

        if (!fs.existsSync(templatePath)) {
            console.error('❌ Plantilla no encontrada en:', templatePath);
            return res.status(404).json({ error: 'Plantilla EJS no encontrada' });
        }

        const html = fs.readFileSync(templatePath, 'utf8');
        const htmlRenderizado = ejs.render(html, datos);

        // === 3. Generar PDF con Puppeteer ===
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setContent(htmlRenderizado, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
        });
        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);


    } catch (error) {
        console.error('❌ Error al generar PDF mensual5:', error);
        res.status(500).json({ error: 'Error al generar PDF mensual5', details: error.message, stack: error.stack });
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }

}

module.exports = {
    generarPDF,
    generarPDFMensual,
    generarPDFMensual2,
    generarPDFMensual3,
    generarPDFMensual4,
    generarPDFMensual5
};
