import mongoose, { Document, Schema } from 'mongoose';

export interface IReseña extends Document {
  trabajador_id: mongoose.Types.ObjectId;
  cliente_id: mongoose.Types.ObjectId;
  cliente_nombre: string;
  puntuacion: number;
  comentario?: string;
  createdAt: Date;
}

const reseñaSchema = new Schema<IReseña>(
  {
    trabajador_id: {
      type: Schema.Types.ObjectId,
      ref: 'Trabajador',
      required: true
    },
    cliente_id: {
      type: Schema.Types.ObjectId,
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

export default mongoose.model<IReseña>('Reseña', reseñaSchema);
