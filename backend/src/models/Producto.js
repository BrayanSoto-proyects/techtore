// Modelo de productos: controla inventario, precios, categorías y SKU único.
import mongoose from'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre del producto es obligatorio'], trim: true },
  descripcion: { type: String, trim: true },
  precio: { type: Number, required: [true, 'El precio es obligatorio'], min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  categoria: { type: String, enum: ['Electrónica', 'Accesorios', 'Computación', 'Audio', 'Gaming', 'Otro'], default: 'Otro' },
  sku: { type: String, unique: true, uppercase: true, trim: true },
  activo: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

// Genera SKU cuando el usuario no lo proporciona.
productoSchema.pre('validate', function(next) {
  if (!this.sku) {
    const base = (this.nombre || 'PROD').replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase();
    this.sku = `${base}-${Date.now().toString().slice(-6)}`;
  }
  next();
});

export default mongoose.model('Producto', productoSchema);
