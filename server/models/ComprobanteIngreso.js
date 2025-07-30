const mongoose = require('mongoose');

const comprobanteIngresoSchema = new mongoose.Schema({
    _id: { type: String },  // Aquí usamos directamente _id como recing
    numeroregistro: { type: String, required: true, ref: 'ReporteDiario' },
    serie: { type: Number, required: true },
    nombre: { type: String, trim: true },
    direccion: { type: String, trim: true },
    ruc: { type: String, trim: true },
    dni: { type: String, trim: true },
    numcelular: { type: String, trim: true },
    anulado: { type: Boolean, default: false },
    grav: { type: String, required: true },
    igv: { type: Number, required: true },
    detalle: { type: String, trim: true }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('ComprobanteIngreso', comprobanteIngresoSchema);
