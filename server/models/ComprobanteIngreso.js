const mongoose = require('mongoose');
const Counter = require('./counter.model');

const comprobanteIngresoSchema = new mongoose.Schema({
    _id: { type: Number },  // Aquí usamos directamente _id como recing
    numeroregistro: { type: Number, required: true, ref: 'ReporteDiario' },
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
    timestamps: true,
    versionKey: false
});

// Hook para autoincrementar _id
comprobanteIngresoSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'comprobanteIngreso' },   // Este será el nombre del contador
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    this._id = counter.seq;
    next();
});

module.exports = mongoose.model('ComprobanteIngreso', comprobanteIngresoSchema);
