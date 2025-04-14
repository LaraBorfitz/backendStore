const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/uploadMiddleware");

// Ruta para subir una imagen y obtener su URL
router.post(
  "/image", 
  authMiddleware, 
  upload.single('image'), 
  uploadController.uploadImage
);

module.exports = router;
