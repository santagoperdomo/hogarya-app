import mongoose, { Document, Schema } from 'mongoose';

export interface ISolicitud extends Document {
  cliente_id: mongoose.Types.ObjectId;
  trabajador_id: mongoose.Types.ObjectId;
  servicio: string;
  descripcion: string;
  fecha_preferida?: Date;
  direccion?: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'completada' | 'cancelada';
  precio_acordado?: number;
  notas_trabajador?: string;
  calificacion?: number;
  comentario_calificacion?: string;
  imagenes_reseña?: string[];
  evidencias_trabajador?: string[];
  mensajes_chat?: {
    remitente: 'cliente' | 'trabajador';
    mensaje: string;
    timestamp: Date;
  }[];
  fecha_completado?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const solicitudSchema = new Schema<ISolicitud>(
  {
    cliente_id: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    trabajador_id: {
      type: Schema.Types.ObjectId,
      ref: 'Trabajador',
      required: true
    },
    servicio: {
      type: String,
      required: [true, 'El tipo de servicio es requerido'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true
    },
    fecha_preferida: {
      type: Date
    },
    direccion: {
      type: String,
      trim: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada'],
      default: 'pendiente'
    },
    precio_acordado: {
      type: Number,
      min: 0
    },
    notas_trabajador: {
      type: String,
      trim: true
    },
    calificacion: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario_calificacion: {
      type: String,
      trim: true
    },
    imagenes_reseña: [{
      type: String,
      trim: true
    }],
    evidencias_trabajador: [{
      type: String,
      trim: true
    }],
    mensajes_chat: [{
      remitente: {
        type: String,
        enum: ['cliente', 'trabajador'],
        required: true
      },
      mensaje: {
        type: String,
        required: true,
        trim: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    fecha_completado: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

solicitudSchema.index({ cliente_id: 1, createdAt: -1 });
solicitudSchema.index({ trabajador_id: 1, createdAt: -1 });
solicitudSchema.index({ estado: 1 });

export default mongoose.model<ISolicitud>('Solicitud', solicitudSchema);
