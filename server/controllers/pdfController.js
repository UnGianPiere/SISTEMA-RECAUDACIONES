const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const { numeroALetras } = require('../utils/numeroALetras');
const { datosPDF } = require('./reporteDiarioController');
const { datosPDFMensual, obtenerDatosReporteMensual, obtenerDatosReporteMensual2, datosPDFAnual } = require('./reporteMensualController');
//genera un PDF para reporte diario
const generarPDF = async (req, res) => {
    let browser; // ✅ Declaración global para try/catch/finally

    try {
        const id = req.params.id;

        const { reporte, comprobantes } = await datosPDF(id);

        const letras = numeroALetras(reporte.total);

        // Fecha y hora Perú (UTC-5)
        const fechaUTC = new Date(reporte.fecha);
        const offsetLima = -5 * 60;
        const fechaPeru = new Date(fechaUTC.getTime() + offsetLima * 60000);
        const dia = fechaPeru.getUTCDate().toString().padStart(2, '0');
        const mes = (fechaPeru.getUTCMonth() + 1).toString().padStart(2, '0');
        const anio = fechaPeru.getUTCFullYear();
        const importe = (reporte.total ?? 0).toFixed(2);
        const recibos = comprobantes.map(comp => {
            const codigo = `CC.${comp.serie.toString().padStart(3, '0')}-${comp._id.toString().split('-')[0].padStart(6, '0')}`;
            const monto = comp.detalles.reduce((sum, det) => sum + (det.cantidad * det.importe), 0);
            return { codigo, monto };
        });

        const logoPath = path.join(__dirname, '../assets/Escudo.png');
        if (!fs.existsSync(logoPath)) {
            return res.status(404).json({ error: 'Logo no encontrado' });
        }
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');

        const fechaUTCNow = new Date();
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const fechaNOW = fechaPeruNow.toLocaleDateString('es-PE');
        const hora = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const datos = {
            fechaNOW,
            hora,
            numero: id.split('-')[0],
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

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const fecha = { mes: meses[mes - 1], anio };

        const datos = {
            fecha,
            importe: sumaTotal.sumaTotal.toFixed(2),
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

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const fechaNOW = fechaPeruNow.toLocaleDateString('es-PE');
        const hora = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });


        const fecha = { mes: meses[mes - 1], anio };
        const datos = {
            fecha,
            importe: sumaTotal.sumaTotal.toFixed(2),
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
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}

//generar pdf referente a hoja de trabajo mensual
const generarPDFMensual3 = async (req, res) => {
    let browser;
    const { anio, mes } = req.params;
    try {
        const sumaTotal = await datosPDFMensual(mes, anio);
        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        // Fecha y hora Perú (UTC-5)
        const fecha = { mes: meses[mes - 1], anio };

        const reportes = await obtenerDatosReporteMensual(anio, mes);

        const datos = {
            fecha,
            total: sumaTotal.sumaTotal.toFixed(2), // total general como string
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


//Generar pdf referente a Documentos Emitidos
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
                    _id: comprobante._id.split('-')[0],
                    serie: comprobante.serie,
                    nombre: comprobante.nombre,
                    anulado: comprobante.anulado,
                    numeroregistro: comprobante.numeroregistro.split('-')[0],
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

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const fechaActual = fechaPeruNow.toLocaleDateString('es-PE');
        const horaActual = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
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

//Generar pdfs referente a Documentos Anulados
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
                    _id: comprobante._id.split('-')[0],
                    serie: comprobante.serie,
                    nombre: comprobante.nombre,
                    anulado: comprobante.anulado,
                    numeroregistro: comprobante.numeroregistro.split('-')[0],
                    monto,
                    fecha: new Date(reporte.fecha).toISOString().split('T')[0].split('-').reverse().join('/')
                };
            })
        );

        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const fechaActual = fechaPeruNow.toLocaleDateString('es-PE');
        const horaActual = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
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

//generar Comprobantes de caja
const generarPDFComprobanteCaja = async (req, res) => {
    const data = req.body
    let browser;
    try {
        const total = data.tablaData.reduce((total, item) => {
            return total + item.total
        }, 0);
        const totalLetras = numeroALetras(total);

        const tupaData = data.tablaData.map(element => ({
            codigo: element._id,
            descripcion: element.descripcion,
            precUnitario: element.importe,
            Cantidad: element.cantidad,
            valorVenta: element.total
        }));

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const dia = fechaPeruNow.getUTCDate().toString().padStart(2, '0');
        const mes = fechaPeruNow.toLocaleString('es-PE', { month: 'long' });
        const anio = fechaPeruNow.getUTCFullYear().toString().slice(-2);
        const hora = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const datos = {
            nombre: data.datosRegistro.nombre,
            direccion: data.datosRegistro.direccion,
            DNIRUC: data.datosRegistro.numeroDocumento,
            fecha: {
                dia,
                mes,
                anio,
                hora
            },
            tupaData,
            totalLetras,
            total
        };

        // Ruta a tu plantilla .ejs
        const templatePath = path.join(__dirname, '../views/comprobanteCaja.ejs');
        const html = fs.readFileSync(templatePath, 'utf8');

        // Rellenar la plantilla con los datos
        const htmlRenderizado = ejs.render(html, datos);

        // Generar PDF
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
            height: `167mm`,
            width: `222mm`,  // alto más corto
            printBackground: false,
            landscape: true,   // NO usar landscape porque ya ajustamos width/height en horizontal
            margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
        });

        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error(`El error es ${error}`)
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}

//generar Comprobantes de caja para revisualizar en la tabla
const generarPDFComprobanteShow = async (req, res) => {
    const data = req.body
    let browser;
    try {

        const totalLetras = numeroALetras(data.total);

        // Fecha y hora Perú (UTC-5)
        const fechaUTCNow = new Date();
        const offsetLima = -5 * 60;
        const fechaPeruNow = new Date(fechaUTCNow.getTime() + offsetLima * 60000);
        const dia = fechaPeruNow.getUTCDate().toString().padStart(2, '0');
        const mes = fechaPeruNow.toLocaleString('es-PE', { month: 'long' });
        const anio = fechaPeruNow.getUTCFullYear().toString().slice(-2);
        const hora = fechaPeruNow.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });


        const datos = {
            ...data,
            fecha: {
                dia,
                mes,
                anio,
                hora
            },
            totalLetras,
        };

        // Ruta a tu plantilla .ejs
        const templatePath = path.join(__dirname, '../views/comprobanteCaja.ejs');
        const html = fs.readFileSync(templatePath, 'utf8');

        // Rellenar la plantilla con los datos
        const htmlRenderizado = ejs.render(html, datos);

        // Generar PDF
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
            height: `167mm`,
            width: `222mm`,  // alto más corto
            printBackground: false,
            landscape: true,   // NO usar landscape porque ya ajustamos width/height en horizontal
            margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
        });

        // === 4. Enviar PDF como respuesta (inline para ver en navegador/Postman) ===
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=recibo.pdf',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error(`El error es ${error}`)
    }
    finally {
        if (browser) {
            await browser.close().then(() => console.log('Browser closed'));
        }
    }
}



const generarPDFAnual = async (req, res) => {
    const { anio } = req.params;
    let browser;
    const datosAnual = await datosPDFAnual(anio)
    console.log(datosAnual);

    const montosPorMes = datosAnual.reduce((acc, reporte) => {
        const fecha = new Date(reporte.fecha);
        const mes = fecha.getUTCMonth(); // 0 = enero, 11 = diciembre

        const nombresMes = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"
        ];

        const nombreMes = nombresMes[mes];

        if (!acc[nombreMes]) {
            acc[nombreMes] = 0;
        }

        acc[nombreMes] += reporte.total || 0;

        return acc;
    }, {
        enero: 0,
        febrero: 0,
        marzo: 0,
        abril: 0,
        mayo: 0,
        junio: 0,
        julio: 0,
        agosto: 0,
        setiembre: 0,
        octubre: 0,
        noviembre: 0,
        diciembre: 0
    });

    const total = Object.values(montosPorMes).reduce((acc, val) => acc + val, 0);

    const montosAnual = {
        total,
        ...montosPorMes
    }

    console.log(montosAnual);

    try {
        const datos = {
            anio,
            montosAnual
        };

        // === 2. Renderizar la plantilla EJS ===
        const templatePath = path.join(__dirname, '../views/reporteAnual.ejs');

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
            landscape: true,
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '5mm', bottom: '5mm', left: '5mm', right: '5mm' }
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
    generarPDFMensual5,
    generarPDFComprobanteCaja,
    generarPDFAnual,
    generarPDFComprobanteShow
};
