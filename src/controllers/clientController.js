const User = require("../models/User");
const mongoose = require("mongoose");

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Get user's closet
const getCloset = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("closet");
    res.json({ ok: true, closet: user.closet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al obtener el closet" });
  }
};

// Add clothing item to closet
const addClothingItem = async (req, res) => {
  try {
    const {
      nombre,
      talle,
      color,
      categoria,
      subcategoria,
      textura,
      estacion,
      ocasion,
    } = req.body;

    // Validate required fields
    if (
      !nombre ||
      !talle ||
      !color ||
      !categoria ||
      !subcategoria ||
      !textura ||
      !estacion ||
      !ocasion
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    // Inicializar la URL de la imagen como vacía
    let imageURL = "";

    // Si hay un archivo de imagen cargado
    if (req.file) {
      // Crear la URL para acceder a la imagen
      imageURL = `/api/images/${req.file.filename}`;
      console.log("Imagen subida con éxito:", req.file.filename);
    }

    const newItem = {
      nombre,
      talle,
      color,
      categoria,
      subcategoria,
      textura,
      estacion,
      ocasion,
      imageURL, // Usar la URL generada o cadena vacía
    };

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    if (!user.closet) {
      console.log("no existia closet, se creo");
      user.closet = [];
    }
    user.closet.push(newItem);
    console.log("POR FIN SE AGREGO LA PRENDA: ", newItem);

    await user.save();

    res.json({ ok: true, closet: user.closet, item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al agregar la prenda" });
  }
};

// Update clothing item
const updateClothingItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updates = req.body;

    const user = await User.findById(req.user.id);
    const itemIndex = user.closet.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ ok: false, message: "Prenda no encontrada" });
    }

    user.closet[itemIndex] = {
      ...user.closet[itemIndex].toObject(),
      ...updates,
    };
    await user.save();

    res.json({ ok: true, item: user.closet[itemIndex] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, message: "Error al actualizar la prenda" });
  }
};

// Delete clothing item
const deleteClothingItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findById(req.user.id);

    const itemIndex = user.closet.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    user.closet.splice(itemIndex, 1);
    await user.save();

    res.json({ ok: true, message: "Prenda eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al eliminar la prenda" });
  }
};

module.exports = {
  getProfile,
  getCloset,
  addClothingItem,
  updateClothingItem,
  deleteClothingItem,
};
