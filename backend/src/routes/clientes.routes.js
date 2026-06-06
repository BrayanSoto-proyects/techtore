// Rutas de clientes: listado, búsqueda, creación y actualización.
import express from "express";
import Cliente from "../models/Cliente.js";
import proteger from "../middleware/auth.js";

const router = express.Router();

router.use(proteger);

router.get("/", async (req, res) => {
  try {
    const { q = "" } = req.query;

    const filtro = {
      activo: true,
      ...(q
        ? {
            $or: [
              { nombre: new RegExp(q, "i") },
              { email: new RegExp(q, "i") },
            ],
          }
        : {}),
    };

    res.json(await Cliente.find(filtro).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar clientes",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cliente",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio",
      });
    }

    res.status(201).json(await Cliente.create(req.body));
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear cliente",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cliente",
      error: error.message,
    });
  }
});

export default router;