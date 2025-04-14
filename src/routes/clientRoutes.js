const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");
const upload = require("../middlewares/uploadMiddleware");

router.get("/profile", authMiddleware, clientController.getProfile);

router.get("/closet", authMiddleware, clientController.getCloset);

// Ruta para añadir una prenda con imagen
router.post(
  "/addcloset", 
  authMiddleware, 
  (req, res, next) => {
    console.log('Middleware de autenticación pasado, procesando carga de archivos...');
    next();
  },
  upload.single('image'), 
  (req, res, next) => {
    console.log('Middleware de carga de archivos completado, req.file:', req.file);
    next();
  },
  clientController.addClothingItem
);

router.put(
  "/changecloset/:id",
  authMiddleware,
  clientController.updateClothingItem
);

router.delete(
  "/deletecloset/:id",
  authMiddleware,
  clientController.deleteClothingItem
);

module.exports = router;
