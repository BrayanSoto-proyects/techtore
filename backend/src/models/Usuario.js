// Modelo de usuarios: guarda credenciales seguras y roles del sistema.
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email: { type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: 6 },
  rol: { type: String, enum: ['admin', 'vendedor'], default: 'vendedor' },
  activo: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

// Hashea la contraseña antes de guardar si fue modificada.
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compara contraseñas durante el login.
usuarioSchema.methods.compararPassword = function(passwordIngresado) {
  return bcrypt.compare(passwordIngresado, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
