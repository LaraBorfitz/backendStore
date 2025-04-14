const express = require('express');
const router = express.Router();
const PublicRopa = require('../models/PublicRopa');

// CRUD para la colección publicropa
// Obtener todos los items de ropa
router.get('/ropa', async (req, res) => {
  try {
    const ropas = await PublicRopa.find();
    res.json({ropa: ropas, ok: true});
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los items de ropa', error: error.message, ok: false });
  }
});

// Obtener un item de ropa por ID
router.get('/ropa/:id', async (req, res) => {
  try {
    const ropa = await PublicRopa.findById(req.params.id);
    if (!ropa) {
      return res.status(404).json({ message: 'Item de ropa no encontrado' });
    }
    res.json(ropa);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el item de ropa', error: error.message });
  }
});

// Crear un nuevo item de ropa
router.post('/ropa', async (req, res) => {
  try {
    const nuevaRopa = new PublicRopa(req.body);
    const ropaSaved = await nuevaRopa.save();
    res.status(201).json(ropaSaved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el item de ropa', error: error.message });
  }
});

// Actualizar un item de ropa
router.put('/ropa/:id', async (req, res) => {
  try {
    const ropaActualizada = await PublicRopa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!ropaActualizada) {
      return res.status(404).json({ message: 'Item de ropa no encontrado' });
    }
    
    res.json(ropaActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el item de ropa', error: error.message });
  }
});

// Eliminar un item de ropa
router.delete('/ropa/:id', async (req, res) => {
  try {
    const ropaEliminada = await PublicRopa.findByIdAndDelete(req.params.id);
    
    if (!ropaEliminada) {
      return res.status(404).json({ message: 'Item de ropa no encontrado' });
    }
    
    res.json({ message: 'Item de ropa eliminado correctamente', ropa: ropaEliminada });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el item de ropa', error: error.message });
  }
});

module.exports = router;