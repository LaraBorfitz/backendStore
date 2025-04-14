const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Crear almacenamiento GridFS
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generar un nombre de archivo único
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Nombre de la colección en MongoDB
        };
        resolve(fileInfo);
      });
    });
  }
});

// Configurar multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    console.log('Procesando archivo:', file.originalname);
    console.log('Tipo MIME:', file.mimetype);
    
    // Verificar que sea una imagen
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      console.log('Archivo aceptado:', file.originalname);
      return cb(null, true);
    }
    console.log('Archivo rechazado:', file.originalname);
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
  }
});

module.exports = upload;
