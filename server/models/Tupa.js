const mongoose = require('mongoose');

const TupaSchema = new mongoose.Schema({
    _id: { type: Number}, // CODIGO: "0001"
    descripcion: { type: String, required: true, trim: true },
    medida: { type: String, required: true, trim: true },
    importe: { type: Number, required: true },
    espece: { type: String, required: true, trim: true } // código como "1.3.210.1.5"
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Tupa', TupaSchema);
