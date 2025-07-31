// controllers/backupController.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { Parser } = require('json2csv');

const mongoUri = process.env.MONGO_URI;

exports.generarBackup = async (req, res) => {
    try {
        await mongoose.connect(mongoUri);
        const db = mongoose.connection.db;

        const collections = await db.listCollections().toArray();

        const archive = archiver('zip', { zlib: { level: 9 } });

        // Set headers para forzar la descarga
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename=backup-${Date.now()}.zip`
        });

        // Pipe directo al cliente
        archive.pipe(res);

        for (const col of collections) {
            const docs = await db.collection(col.name).find().toArray();

            if (docs.length > 0) {
                const parser = new Parser();
                const csv = parser.parse(docs);
                archive.append(csv, { name: `${col.name}.csv` });
            }
        }

        await archive.finalize();

    } catch (error) {
        console.error('❌ Error en el backup:', error);
        res.status(500).json({ error: 'Error al generar el backup' });
    }
};
