import mongoose from "mongoose";

// Conecta a MongoDB y detiene la app si la URI no existe.
const conectarDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Falta la variable MONGODB_URI en el archivo .env");
    }

    const conexion = await mongoose.connect(process.env.MONGODB_URI);

    if (process.env.NODE_ENV !== "production") {
      console.log(`MongoDB conectado: ${conexion.connection.host}`);
    }
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
