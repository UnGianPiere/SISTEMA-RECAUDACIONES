const mongoose = require("mongoose");

// Definición del esquema para clasificacion_ingresos
const ClasificacionIngresoSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            unique: true, // No debe repetirse
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        collection: "clasificacion_ingresos", // Nombre exacto de la colección en MongoDB
        versionKey: false
    }
);

// Exportar el modelo
module.exports = mongoose.model(
    "ClasificacionIngreso",
    ClasificacionIngresoSchema
);
