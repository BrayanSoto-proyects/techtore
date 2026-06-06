// Modelo de ventas: registra productos vendidos, totales, folio y estado.
import mongoose from 'mongoose';

const itemVentaSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, min: 1 },
  precioUnitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const ventaSchema = new mongoose.Schema({
  folio: { type: String, unique: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [itemVentaSchema],
  subtotal: { type: Number, default: 0 },
  iva: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  metodoPago: { type: String, enum: ['Efectivo', 'Tarjeta', 'Transferencia'], required: true },
  estado: { type: String, enum: ['completada', 'cancelada'], default: 'completada' },
  notas: String,
  fecha: { type: Date, default: Date.now }
});

// Calcula subtotales y genera folio antes de validar.
ventaSchema.pre('validate', function(next) {
  this.productos = this.productos.map(item => ({
    ...item.toObject?.() || item,
    subtotal: Number(item.cantidad) * Number(item.precioUnitario)
  }));
  this.subtotal = this.productos.reduce((sum, item) => sum + item.subtotal, 0);
  this.iva = Number((this.subtotal * 0.16).toFixed(2));
  this.total = Number((this.subtotal + this.iva).toFixed(2));
  if (!this.folio) this.folio = `VENTA-${Date.now().toString().slice(-6)}`;
  next();
});

export default mongoose.model('Venta', ventaSchema);
