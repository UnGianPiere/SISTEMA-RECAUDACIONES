const Tupa = require('../models/Tupa');

// Crear TUPA
exports.crearTupa = async (req, res) => {
    try {
        const nuevoTupa = new Tupa(req.body);
        await nuevoTupa.save();
        res.status(201).json(nuevoTupa);
    } catch (err) {
        console.error('❌ Error al crear TUPA:', err);
        res.status(400).json({ error: 'Error al crear TUPA' });
    }
};

// Obtener todos los TUPAs
exports.obtenerTupas = async (req, res) => {
    try {
        const registros = await Tupa.find();
        res.json(registros);
    } catch (err) {
        console.error('❌ Error al obtener TUPAs:', err);
        res.status(500).json({ error: 'Error al obtener TUPAs' });
    }
};

//Obetener un tupo por id
exports.obtenerTupasPorId= async (req, res) => {
    const id = req.params.id
    try {
        const data = await Tupa.findById(id)
        if(!data){
            return res.status(404).json({error: "Tupa no encontrado"})
        }

        res.status(200).json(data)
    } catch (error) {
        console.error("EL ERROR:",error)
        res.status(500).json({error: "Error al encontrar tupa"})
    }
}

// Actualizar un TUPA por ID
exports.actualizarTupa = async (req, res) => {
    const id = req.params.id;
    try {
        const actualizado = await Tupa.findByIdAndUpdate(id, req.body, {
            new: true,           // devuelve el documento actualizado
            runValidators: true  // valida el esquema
        });

        if (!actualizado) {
            return res.status(404).json({ error: "TUPA no encontrado para actualizar" });
        }

        res.status(200).json(actualizado);
    } catch (error) {
        console.error("❌ Error al actualizar TUPA:", error);
        res.status(500).json({ error: "Error al actualizar TUPA" });
    }
};