const mongoose = require('mongoose');

const ReporteDiarioSchema = new mongoose.Schema({
    _id: { type: String}, // El _id es el RIC o número de registro
    fecha: { type: Date, default: Date.now}, // Fecha del reporte diario
    ctapa1: { type: String, required: true },
    ctapa2: { type: String, required: true },
    total: { type: Number, required: false } // Total recaudado en el día
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ReporteDiario', ReporteDiarioSchema);
