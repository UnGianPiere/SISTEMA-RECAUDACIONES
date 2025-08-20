require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Rutas
const clasificacion_ingresos = require('./routes/clasificacionRoutes');
const cuentasRecaudoRoutes = require('./routes/cuentasRecaudoRoutes');
const TupaRoutes = require('./routes/tupaRoutes');
const comprobanteIngresoRoutes = require('./routes/comprobanteIngresoRoutes');
const comprobanteDetalleRoutes = require('./routes/comprobanteDetalleRoutes');
const reporteDiarioRoutes = require('./routes/reporteDiarioRouters');
const pdfRoutes = require('./routes/pdfRoutes');
const reporteMensualRoutes = require('./routes/reporteMensualRouters');
const backupRoutes=require('./routes/backupRoutes')
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(err => console.error('❌ Error al conectar con MongoDB:', err));

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/clasificacion', clasificacion_ingresos);
app.use('/api/cuentas', cuentasRecaudoRoutes);
app.use('/api/tupa', TupaRoutes);
app.use('/api/comprobantes', comprobanteIngresoRoutes);
app.use('/api/comprobantes-detalle', comprobanteDetalleRoutes);
app.use('/api/reporte-diario', reporteDiarioRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/reporte-mensual', reporteMensualRoutes);
app.use('/api/backup',backupRoutes)
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
