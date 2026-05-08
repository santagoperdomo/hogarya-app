import mongoose from 'mongoose';

const trabajadorSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      unique: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    servicios: {
      type: [String],
      default: []
    },
    descripcion: {
      type: String,
      default: '',
      trim: true
    },
    disponible: {
      type: Boolean,
      default: true
    },
    calificacion: {
      type: Number,
      default: 5.0,
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5']
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true
    },
    numReseñas: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

trabajadorSchema.index({ servicios: 1 });
trabajadorSchema.index({ nombre: 'text', servicios: 'text' });

export default mongoose.model('Trabajador', trabajadorSchema);
