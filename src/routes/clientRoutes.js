const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");
const upload = require("../middlewares/uploadMiddleware");

router.get("/profile", authMiddleware, clientController.getProfile);

router.get("/closet", authMiddleware, clientController.getCloset);

router.post("/addcloset", authMiddleware, upload.single('image'), clientController.addClothingItem);

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
