// src/models/PublicRopa.js
const mongoose = require('mongoose');

const publicRopaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  talla: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

const PublicRopa = mongoose.model('PublicRopa', publicRopaSchema);

module.exports = PublicRopa;
