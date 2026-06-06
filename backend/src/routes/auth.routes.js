// Rutas de autenticación: registro, login y usuario actual.
import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import proteger from "../middleware/auth.js";

const router = express.Router();

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || password.length < 6) {
      return res.status(400).json({
        mensaje: "Nombre, email y contraseña mínima de 6 caracteres son obligatorios",
      });
    }

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({
        mensaje: "Ya existe un usuario con ese email",
      });
    }

    const usuario = await Usuario.create({ nombre, email, password, rol });

    res.status(201).json({
      token: generarToken(usuario),
      usuario: {
        id: usuario._id,
        nombre,
        email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        mensaje: "Usuario inactivo",
      });
    }

    res.json({
      token: generarToken(usuario),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
});

router.get("/me", proteger, async (req, res) => {
  res.json({ usuario: req.usuario });
});

export default router;