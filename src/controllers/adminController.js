const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// CRUD Administrador
router.get('/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  res.json({ message: 'Lista de usuarios' });
});

router.get('/users/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  res.json({ message: `Detalles del usuario ${req.params.id}` });
});

router.post('/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  res.json({ message: 'Usuario creado' });
});

router.put('/users/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  res.json({ message: `Usuario ${req.params.id} actualizado` });
});

router.delete('/users/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  res.json({ message: `Usuario ${req.params.id} eliminado` });
});

module.exports = router;