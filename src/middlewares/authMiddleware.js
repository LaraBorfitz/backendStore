const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log('Verificando autenticación...');
  
  // Obtener el token del header Authorization
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    console.log('No se proporcionó token de autorización');
    return res.status(401).json({ 
      message: 'Acceso denegado. No hay token proporcionado.',
      ok: false 
    });
  }

  console.log('Token recibido:', authHeader);

  // Verificar el formato del token (Bearer token)
  const tokenParts = authHeader.split(' ');
  const token = tokenParts.length === 2 && tokenParts[0] === 'Bearer' 
    ? tokenParts[1] 
    : authHeader;

  console.log('Token a verificar:', token.substring(0, 20) + '...');

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado correctamente. Usuario:', decoded.id, 'Rol:', decoded.role);
    
    // Añadir la información del usuario decodificada a la solicitud
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    res.status(401).json({ 
      message: 'Token inválido o expirado.', 
      ok: false 
    });
  }
};

module.exports = authMiddleware;