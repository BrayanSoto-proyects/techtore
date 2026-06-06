// Modelo de clientes: almacena datos de contacto y dirección para ventas.
import mongoose from'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre del cliente es obligatorio'], trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  telefono: { type: String, trim: true },
  direccion: {
    calle: String,
    ciudad: String,
    estado: String,
    cp: String
  },
  rfc: { type: String, trim: true, uppercase: true },
  activo: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export default mongoose.model('Cliente', clienteSchema);
