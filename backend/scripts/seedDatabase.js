import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import mongoose from "mongoose";

import Usuario from "../src/models/Usuario.js";
import Producto from "../src/models/Producto.js";
import Cliente from "../src/models/Cliente.js";
import Venta from "../src/models/Venta.js";

dotenv.config();

const ejecutarSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conectado a MongoDB");
    console.log("Eliminando base de datos actual...");

    await mongoose.connection.db.dropDatabase();

    console.log("Base de datos eliminada.");

    // USUARIOS

    const admin = await Usuario.create({
      nombre: "Carlos Mendoza",
      email: "admin@techstore.com",
      password: "admin123",
      rol: "admin",
    });

    const vendedor1 = await Usuario.create({
      nombre: "Ana López",
      email: "ana@techstore.com",
      password: "ana123",
      rol: "vendedor",
    });

    const vendedor2 = await Usuario.create({
      nombre: "Jorge Ramírez",
      email: "jorge@techstore.com",
      password: "jorge123",
      rol: "vendedor",
    });

    // PRODUCTOS

    const productos = await Producto.insertMany([
      {
        nombre: "Laptop Lenovo ThinkPad E14",
        descripcion: "Laptop empresarial Ryzen 7",
        precio: 18999,
        stock: 14,
        categoria: "Computación",
      },
      {
        nombre: "MacBook Air M2",
        descripcion: "Apple Silicon",
        precio: 27999,
        stock: 8,
        categoria: "Computación",
      },
      {
        nombre: "Monitor Samsung 27 4K",
        descripcion: "Monitor UHD",
        precio: 6999,
        stock: 12,
        categoria: "Computación",
      },
      {
        nombre: "Teclado Mecánico Logitech",
        descripcion: "Teclado RGB",
        precio: 1899,
        stock: 25,
        categoria: "Gaming",
      },
      {
        nombre: "Mouse Logitech MX Master 3",
        descripcion: "Mouse profesional",
        precio: 2499,
        stock: 18,
        categoria: "Accesorios",
      },
      {
        nombre: "SSD Kingston 1TB",
        descripcion: "NVMe PCIe 4.0",
        precio: 1399,
        stock: 30,
        categoria: "Computación",
      },
      {
        nombre: "Memoria RAM 16GB DDR5",
        descripcion: "Kingston Fury",
        precio: 1799,
        stock: 22,
        categoria: "Computación",
      },
      {
        nombre: "Webcam Logitech C920",
        descripcion: "Full HD",
        precio: 1599,
        stock: 16,
        categoria: "Accesorios",
      },
      {
        nombre: "Smartwatch Huawei GT",
        descripcion: "Monitoreo deportivo",
        precio: 3499,
        stock: 10,
        categoria: "Electrónica",
      },
      {
        nombre: "Audífonos Sony WH-CH520",
        descripcion: "Bluetooth",
        precio: 1499,
        stock: 20,
        categoria: "Audio",
      },
      {
        nombre: "Router TP-Link AX3000",
        descripcion: "WiFi 6",
        precio: 2299,
        stock: 15,
        categoria: "Electrónica",
      },
      {
        nombre: "Tablet Samsung Galaxy Tab",
        descripcion: "10 pulgadas",
        precio: 8999,
        stock: 7,
        categoria: "Electrónica",
      },
      {
        nombre: "Impresora HP Smart Tank",
        descripcion: "Multifuncional",
        precio: 5499,
        stock: 6,
        categoria: "Electrónica",
      },
      {
        nombre: "Control Xbox Series",
        descripcion: "Wireless",
        precio: 1699,
        stock: 17,
        categoria: "Gaming",
      },
      {
        nombre: "Disco Duro Externo 2TB",
        descripcion: "USB 3.0",
        precio: 1899,
        stock: 11,
        categoria: "Computación",
      },
      {
        nombre: "Bocina JBL Flip 6",
        descripcion: "Bluetooth portátil",
        precio: 2999,
        stock: 9,
        categoria: "Audio",
      },
      {
        nombre: "Hub USB-C",
        descripcion: "7 puertos",
        precio: 699,
        stock: 35,
        categoria: "Accesorios",
      },
      {
        nombre: "Cable USB-C",
        descripcion: "Carga rápida",
        precio: 199,
        stock: 60,
        categoria: "Accesorios",
      },
      {
        nombre: "Silla Gamer",
        descripcion: "Ergonómica",
        precio: 4499,
        stock: 5,
        categoria: "Gaming",
      },
      {
        nombre: "Proyector Epson",
        descripcion: "Full HD",
        precio: 11999,
        stock: 4,
        categoria: "Electrónica",
      },
    ]);

    // CLIENTES

    const clientes = await Cliente.insertMany([
      {
        nombre: "Juan Pérez",
        email: "juan.perez@gmail.com",
        telefono: "6671234567",
        direccion: {
          calle: "Av. Insurgentes 120",
          ciudad: "Culiacán",
          estado: "Sinaloa",
          cp: "80000",
        },
        rfc: "JUAP900101ABC",
      },
      {
        nombre: "María González",
        email: "maria.g@gmail.com",
        telefono: "6675558899",
        direccion: {
          calle: "Blvd. Zapata 80",
          ciudad: "Culiacán",
          estado: "Sinaloa",
          cp: "80100",
        },
        rfc: "MARG910202DEF",
      },
      {
        nombre: "Luis Hernández",
        email: "luis.h@gmail.com",
        telefono: "6674441122",
        direccion: {
          calle: "Colinas 45",
          ciudad: "Mazatlán",
          estado: "Sinaloa",
          cp: "82000",
        },
        rfc: "LUHE920303GHI",
      },
      {
        nombre: "Fernanda Ruiz",
        email: "fernanda@gmail.com",
        telefono: "6678883322",
        direccion: {
          calle: "Centro 56",
          ciudad: "Los Mochis",
          estado: "Sinaloa",
          cp: "81200",
        },
        rfc: "FERU930404JKL",
      },
      {
        nombre: "Miguel Castro",
        email: "miguel@gmail.com",
        telefono: "6671122334",
        direccion: {
          calle: "Las Quintas 15",
          ciudad: "Culiacán",
          estado: "Sinaloa",
          cp: "80020",
        },
        rfc: "MICA940505MNO",
      },
    ]);

    // VENTAS

    const metodosPago = [
      "Efectivo",
      "Tarjeta",
      "Transferencia",
    ];

    for (let i = 0; i < 22; i++) {
      const cliente =
        clientes[Math.floor(Math.random() * clientes.length)];

      const vendedor =
        Math.random() > 0.5 ? vendedor1 : vendedor2;

      const cantidadProductos =
        Math.floor(Math.random() * 3) + 1;

      const productosVenta = [];

      for (let j = 0; j < cantidadProductos; j++) {
        const producto =
          productos[Math.floor(Math.random() * productos.length)];

        const cantidad =
          Math.floor(Math.random() * 3) + 1;

        productosVenta.push({
          producto: producto._id,
          nombre: producto.nombre,
          cantidad,
          precioUnitario: producto.precio,
          subtotal: cantidad * producto.precio,
        });
      }

      const fecha = new Date();
      fecha.setDate(
        fecha.getDate() - Math.floor(Math.random() * 60)
      );

      await Venta.create({
        cliente: cliente._id,
        vendedor: vendedor._id,
        fecha,
        metodoPago:
          metodosPago[
            Math.floor(Math.random() * metodosPago.length)
          ],
        productos: productosVenta,
      });
    }

    console.log("==================================");
    console.log("SEED COMPLETADO");
    console.log("==================================");
    console.log("Usuarios: 3");
    console.log("Productos: 20");
    console.log("Clientes: 5");
    console.log("Ventas: 22");
    console.log("");
    console.log("Admin:");
    console.log("admin@techstore.com");
    console.log("admin123");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

ejecutarSeed();