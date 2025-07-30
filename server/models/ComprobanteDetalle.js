const mongoose = require('mongoose');

const comprobanteDetalleSchema = new mongoose.Schema({
    ingresoId: {
        type: String, // Este es el _id del comprobante de ingreso
        required: true,
        ref: 'ComprobanteIngreso'
    },
    tupaId: {
        type: Number, // Este es el _id del Tupa
        required: true,
        ref: 'Tupa'
    },
    cantidad: {
        type: Number,
        required: true
    },
    importe: {
        type: Number,
        required: true
    },
    igv: {
        type: Number,
        required: true
    },
    detalle: {
        type: String,
        required: false
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('ComprobanteDetalle', comprobanteDetalleSchema);
