import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  email: string;
  password: string;
  nombre: string;
  tipo: 'cliente' | 'trabajador';
  telefono?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    tipo: {
      type: String,
      required: [true, 'El tipo de usuario es requerido'],
      enum: {
        values: ['cliente', 'trabajador'],
        message: 'El tipo debe ser cliente o trabajador'
      }
    },
    telefono: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUsuario>('Usuario', usuarioSchema);
