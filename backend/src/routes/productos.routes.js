// Rutas de productos: CRUD, búsqueda, paginación y stock bajo.
import express from "express";
import Producto from "../models/Producto.js";
import proteger from "../middleware/auth.js";

const router = express.Router();

router.use(proteger);

router.get("/stock-bajo", async (req, res) => {
  try {
    res.json(
      await Producto.find({ stock: { $lt: 5 }, activo: true }).sort({ stock: 1 })
    );
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar stock bajo",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { q = "", page = 1, limit = 50 } = req.query;

    const filtro = {
      activo: true,
      ...(q
        ? {
            $or: [
              { nombre: new RegExp(q, "i") },
              { sku: new RegExp(q, "i") },
            ],
          }
        : {}),
    };

    const productos = await Producto.find(filtro)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Producto.countDocuments(filtro);

    res.json({ productos, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar productos",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Producto.findById(req.params.id);

    if (!p) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(p);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        mensaje: "Nombre, precio y stock son obligatorios",
      });
    }

    res.status(201).json(await Producto.create(req.body));
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const p = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!p) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(p);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const p = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!p) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({
      mensaje: "Producto desactivado correctamente",
      producto: p,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al desactivar producto",
      error: error.message,
    });
  }
});

export default router;
