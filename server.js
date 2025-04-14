const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
// Rutas
const publicRoutes = require('./src/routes/publicRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const connectDB = require('./src/db');
const User = require('./src/models/User');
const { generateToken } = require('./src/services/authService');

dotenv.config();

const app = express();


// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
connectDB();

// Inicializar GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS inicializado para la colección uploads');
});

app.use('/api/public', publicRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Ruta para servir imágenes desde GridFS
app.get('/api/images/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    
    // Verificar si es una imagen
    if (file.contentType.startsWith('image/')) {
      // Crear un stream de lectura
      const readstream = gfs.createReadStream(file.filename);
      // Configurar el tipo de contenido
      res.set('Content-Type', file.contentType);
      // Enviar la imagen como respuesta
      readstream.pipe(res);
    } else {
      res.status(400).json({ message: 'El archivo no es una imagen' });
    }
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    res.status(500).json({ message: 'Error al obtener la imagen' });
  }
});

// Ruta de registro
app.post('/api/register', async (req, res) => {
  const { username, password, role = 'client' } = req.body;
  console.log('Intento de registro:', { username, role });

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log('Usuario ya registrado:', username);
      return res.status(400).json({ 
        message: 'El usuario ya está registrado', 
        ok: false 
      });
    }

    // Crear un nuevo usuario
    const newUser = new User({ username, password, role });

    // Guardar el usuario en la base de datos (la contraseña se encripta automáticamente)
    await newUser.save();
    console.log('Usuario registrado exitosamente:', username);

    // Generar el token JWT
    const token = generateToken(newUser);
    console.log('Token generado para:', username);

    // Información del usuario para devolver (sin la contraseña)
    const userInfo = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role
    };

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      token, 
      user: userInfo,
      ok: true 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error en el servidor', 
      ok: false 
    });
  }
});

// Ruta de login
app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;
    console.log('Intento de login:', username);
  
    try {
      // Buscar el usuario en la base de datos
      const user = await User.findOne({ username });
  
      if (!user) {
        console.log('Usuario no encontrado:', username);
        return res.status(401).json({ message: 'Credenciales inválidas', ok: false });
      }
  
      // Comparar contraseñas
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        console.log('Contraseña incorrecta para:', username);
        return res.status(401).json({ message: 'Credenciales inválidas', ok: false });
      }
  
      // Generar el token JWT
      const token = generateToken(user);
      console.log('Login exitoso para:', username);
  
      // Devolver información del usuario (excluyendo la contraseña)
      const userInfo = {
        id: user._id,
        username: user.username,
        role: user.role
      };
  
      res.json({ 
        message: 'Autenticación exitosa', 
        token, 
        user: userInfo,
        ok: true 
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error en el servidor', ok: false });
    }
  });



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});