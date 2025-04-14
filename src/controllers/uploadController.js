const mongoose = require('mongoose');

// Controlador para subir una imagen y devolver su URL
const uploadImage = async (req, res) => {
  try {
    console.log("==== INICIO DE LA SOLICITUD DE SUBIDA DE IMAGEN ====");
    console.log("Archivo recibido:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ 
        ok: false, 
        message: "No se ha enviado ninguna imagen" 
      });
    }
    
    // Devolver solo la ruta relativa, sin incluir el dominio
    const imageURL = `/api/images/${req.file.filename}`;
    
    console.log("Imagen subida con éxito:", req.file.filename);
    console.log("URL de imagen generada:", imageURL);
    
    // Devolver la URL de la imagen
    res.json({ 
      ok: true, 
      imageURL,
      message: "Imagen subida con éxito" 
    });
    
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Error al subir la imagen" 
    });
  }
};

module.exports = {
  uploadImage
};
