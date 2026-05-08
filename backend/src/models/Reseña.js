import mongoose from 'mongoose';

const reseñaSchema = new mongoose.Schema(
  {
    trabajador_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trabajador',
      required: true
    },
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    cliente_nombre: {
      type: String,
      required: [true, 'El nombre del cliente es requerido'],
      trim: true
    },
    puntuacion: {
      type: Number,
      required: [true, 'La puntuación es requerida'],
      min: [1, 'La puntuación mínima es 1'],
      max: [5, 'La puntuación máxima es 5']
    },
    comentario: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

reseñaSchema.index({ trabajador_id: 1, createdAt: -1 });

export default mongoose.model('Reseña', reseñaSchema);
