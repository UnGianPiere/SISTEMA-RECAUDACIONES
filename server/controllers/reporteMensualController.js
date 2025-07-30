const ComprobanteDetalle = require('../models/ComprobanteDetalle');
const ComprobanteIngreso = require('../models/ComprobanteIngreso');
const ReporteDiario = require('../models/ReporteDiario');

// obtiene todos los reportes mensuales de un año y mes específicos
const obtenerReporteMensual = async (req, res) => {
    try {
        const { anio, mes } = req.params;
        const datosReporte = await obtenerDatosReporteMensual(anio, mes);
        res.status(200).json(datosReporte);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el reporte mensual', error });
    }
};

// obtiene todos los reportes mensuales mas detallado de un año y mes específicos
const obtenerReporteMensual2 = async (req, res) => {
    try {
        const { anio, mes } = req.params;
        const datosReporte = await obtenerDatosReporteMensual2(anio, mes);
        res.status(200).json(datosReporte);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el reporte mensual', error });
    }
};


const obtenerDatosReporteMensual = async (anio, mes) => {
    const anioNum = parseInt(anio);
    const mesNum = parseInt(mes);

    // Fechas generadas en UTC sin desfasar por zona horaria
    const inicioMes = new Date(Date.UTC(anioNum, mesNum - 1, 1, 0, 0, 0));
    const finMes = new Date(Date.UTC(anioNum, mesNum, 0, 23, 59, 59, 999));

    const datos = await ReporteDiario.find({
        fecha: {
            $gte: inicioMes,
            $lte: finMes
        }
    });

    return datos;
};

// obtiene los datos para el reporte de documentos emitidos
const obtenerDatosReporteMensual2 = async (anio, mes) => {
    const anioNum = parseInt(anio);
    const mesNum = parseInt(mes);

    const inicioMes = new Date(Date.UTC(anioNum, mesNum - 1, 1, 0, 0, 0));
    const finMes = new Date(Date.UTC(anioNum, mesNum, 0, 23, 59, 59, 999));

    const reportes = await ReporteDiario.find({
        fecha: {
            $gte: inicioMes,
            $lte: finMes
        }
    });

    const reportesConComprobantes = await Promise.all(
        reportes.map(async (reporte) => {
            const comprobantes = await ComprobanteIngreso.find({
                numeroregistro: reporte._id
            });

            const comprobantesConDetalle = await Promise.all(
                comprobantes.map(async (comp) => {
                    const detalles = await ComprobanteDetalle.find({ ingresoId: comp._id });
                    return {
                        ...comp.toObject(),
                        detalles,
                    };
                })
            );

            return {
                ...reporte.toObject(),
                comprobantes: comprobantesConDetalle,
            };
        })
    );

    return reportesConComprobantes;
};


async function datosPDFMensual(mes, anio) {
    const anioNum = parseInt(anio);
    const mesNum = parseInt(mes);

    // Crear rango de fechas del mes
    const inicioMes = new Date(Date.UTC(anioNum, mesNum - 1, 1));
    const finMes = new Date(Date.UTC(anioNum, mesNum, 0, 23, 59, 59, 999));
    const datosReporte = await ReporteDiario.find({
        fecha: {
            $gte: inicioMes,
            $lte: finMes
        }
    });
    // Sumar los totales de cada reporte diario
    const sumaTotal = datosReporte.reduce((total, reporte) => {
        return total + (reporte.total || 0); // Asegurarse de que 'total' exista
    }, 0);
    return { sumaTotal };
}


async function datosPDFAnual(anio) {
    const anioNum = parseInt(anio);

    // Crear rango de fechas del año completo (1 enero a 31 diciembre)
    const inicioAnio = new Date(Date.UTC(anioNum, 0, 1)); // 1 enero
    const finAnio = new Date(Date.UTC(anioNum, 11, 31, 23, 59, 59, 999)); // 31 diciembre

    const datosReporte = await ReporteDiario.find({
        fecha: {
            $gte: inicioAnio,
            $lte: finAnio
        }
    });


    return datosReporte;
}



module.exports = {
    obtenerReporteMensual,
    obtenerReporteMensual2,
    datosPDFMensual,
    obtenerDatosReporteMensual,
    obtenerDatosReporteMensual2,
    datosPDFAnual
};
