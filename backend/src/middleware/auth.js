// Middleware de autenticación: valida JWT y adjunta el usuario autenticado a req.usuario.
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const proteger = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'No se proporcionó token de autenticación' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

export default proteger;
