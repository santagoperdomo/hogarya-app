import { Response } from 'express';
import Reseña from '../models/Reseña';
import Trabajador from '../models/Trabajador';
import { AuthRequest } from '../middleware/auth.middleware';

export const createReseña = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trabajador_id, puntuacion, comentario } = req.body;

    if (!trabajador_id || !puntuacion) {
      res.status(400).json({
        success: false,
        message: 'trabajador_id y puntuacion son requeridos'
      });
      return;
    }

    if (puntuacion < 1 || puntuacion > 5) {
      res.status(400).json({
        success: false,
        message: 'La puntuación debe estar entre 1 y 5'
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const trabajador = await Trabajador.findById(trabajador_id);
    if (!trabajador) {
      res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
      return;
    }

    const reseña = await Reseña.create({
      trabajador_id,
      cliente_id: req.user.id,
      cliente_nombre: req.user.email,
      puntuacion,
      comentario
    });

    const todasReseñas = await Reseña.find({ trabajador_id });
    const totalPuntos = todasReseñas.reduce((sum, r) => sum + r.puntuacion, 0);
    const nuevaCalificacion = totalPuntos / todasReseñas.length;

    trabajador.calificacion = Math.round(nuevaCalificacion * 10) / 10;
    trabajador.numReseñas = todasReseñas.length;
    await trabajador.save();

    res.status(201).json({
      success: true,
      data: reseña
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear reseña'
    });
  }
};

export const getReseñasByTrabajador = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trabajador_id } = req.params;

    const reseñas = await Reseña.find({ trabajador_id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reseñas
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener reseñas'
    });
  }
};
