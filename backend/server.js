import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import conectarDB from "./src/config/db.js";
import errorHandler from "./src/middleware/errorHandler.js";

import authRoutes from "./src/routes/auth.routes.js";
import productosRoutes from "./src/routes/productos.routes.js";
import clientesRoutes from "./src/routes/clientes.routes.js";
import ventasRoutes from "./src/routes/ventas.routes.js";
import reportesRoutes from "./src/routes/reportes.routes.js";

dotenv.config();

conectarDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "TechStore API",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/reportes", reportesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Servidor en puerto ${PORT}`);
  }
});