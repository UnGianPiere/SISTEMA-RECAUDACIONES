const mongoose = require('mongoose');
const Counter = require('./counter.model');

const ReporteDiarioSchema = new mongoose.Schema({
    _id: { type: Number}, // El _id es el RIC o número de registro
    fecha: { type: Date, required: true, default: Date.now}, // Fecha del reporte diario
    ctapa1: { type: String, required: true },
    ctapa2: { type: String, required: true },
    total: { type: Number, required: true } // Total recaudado en el día
}, {
    timestamps: true,
    versionKey: false
});

// Middleware: autoincrementar _id
ReporteDiarioSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'reporteDiario' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
    next();
});

module.exports = mongoose.model('ReporteDiario', ReporteDiarioSchema);
