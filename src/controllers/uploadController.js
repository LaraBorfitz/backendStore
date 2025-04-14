const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "backtienda";

// Subir imagen a GridFS
const uploadImage = async (req, res) => {
  let client;
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ ok: false, message: "No se ha enviado ninguna imagen" });
    }
    client = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });
    uploadStream.end(req.file.buffer);
    uploadStream.on("finish", () => {
      const imageURL = `/api/upload/images/${uploadStream.id}`;
      client.close();
      res.json({ ok: true, imageURL, message: "Imagen subida con éxito" });
    });
    uploadStream.on("error", (err) => {
      client.close();
      res
        .status(500)
        .json({
          ok: false,
          message: "Error al subir la imagen",
          error: err.message,
        });
    });
  } catch (error) {
    if (client) client.close();
    res
      .status(500)
      .json({
        ok: false,
        message: "Error al subir la imagen",
        error: error.message,
      });
  }
};

// Descargar imagen de GridFS
const getImage = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const fileId = new ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);
    let fileFound = false;
    downloadStream.on("file", (file) => {
      fileFound = true;
      res.set("Content-Type", file.contentType);
    });
    downloadStream.on("error", () => {
      client.close();
      res.status(404).json({ ok: false, message: "Imagen no encontrada" });
    });
    downloadStream.on("end", () => client.close());
    downloadStream.pipe(res);
  } catch (error) {
    if (client) client.close();
    res
      .status(500)
      .json({
        ok: false,
        message: "Error al obtener la imagen",
        error: error.message,
      });
  }
};

module.exports = { uploadImage, getImage };
