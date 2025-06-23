require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose')
const clasificacion_ingresos=require('./routes/clasificacionRoutes')
const cuentasRecaudoRoutes = require('./routes/cuentasRecaudoRoutes');
const TupaRoutes = require('./routes/tupaRoutes');
const comprobanteIngresoRoutes = require('./routes/comprobanteIngresoRoutes');
const comprobanteDetalleRoutes = require('./routes/comprobanteDetalleRoutes');
const reporteDiarioRoutes = require('./routes/reporteDiarioRouters');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI=process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(MONGO_URI).then(()=>{
  console.log('Conexion exitosa');
}).catch((err)=>{
  console.error(`No se pudo conectar con la base de datos por ${err}`)
})

// Middleware

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/clasificacion',clasificacion_ingresos)
app.use('/api/cuentas', cuentasRecaudoRoutes);
app.use('/api/tupa', TupaRoutes);
app.use('/api/comprobantes', comprobanteIngresoRoutes);
app.use('/api/comprobantes-detalle', comprobanteDetalleRoutes);
app.use('/api/reporte-diario', reporteDiarioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
}); 


// Middleware para rutas no encontradas
app.use((req, res, next) => {
  console.warn(`🚫 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).send(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
});
