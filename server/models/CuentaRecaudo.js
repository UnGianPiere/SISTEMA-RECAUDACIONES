const mongoose = require("mongoose");

const CuentaRecaudoSchema = new mongoose.Schema(
    {
        _id: { type: String }, // Ejemplo: "01"
        descripcion: { type: String, required: true, trim: true },
        cuenta: { type: String, required: true, trim: true },
        nombreBanco: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("CuentaRecaudo", CuentaRecaudoSchema);
