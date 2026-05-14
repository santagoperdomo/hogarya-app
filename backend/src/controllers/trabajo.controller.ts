import { Request, Response } from 'express';
import Solicitud from '../models/Solicitud';
import { AuthRequest } from '../middleware/auth.middleware';

export const marcarCompletado = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const { solicitud_id } = req.params;

    const solicitud = await Solicitud.findById(solicitud_id);
    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    // Verificar que el usuario es cliente o trabajador
    const esCliente = solicitud.cliente_id.toString() === req.user.id;
    const esTrabajador = solicitud.trabajador_id.toString() === req.user.id;

    if (!esCliente && !esTrabajador) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso en esta solicitud'
      });
      return;
    }

    if (solicitud.estado !== 'aceptada') {
      res.status(400).json({
        success: false,
        message: 'La solicitud debe estar aceptada para marcarla como completada'
      });
      return;
    }

    solicitud.estado = 'completada';
    solicitud.fecha_completado = new Date();
    await solicitud.save();

    res.json({
      success: true,
      message: 'Solicitud marcada como completada',
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al completar solicitud'
    });
  }
};

export const agregarEvidencias = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const { solicitud_id } = req.params;
    const { evidencias } = req.body;

    if (!solicitud_id || !Array.isArray(evidencias) || evidencias.length === 0) {
      res.status(400).json({
        success: false,
        message: 'solicitud_id y array de evidencias son requeridos'
      });
      return;
    }

    const solicitud = await Solicitud.findById(solicitud_id);
    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    // Solo el trabajador puede agregar evidencias
    if (solicitud.trabajador_id.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Solo el trabajador puede agregar evidencias'
      });
      return;
    }

    if (solicitud.estado !== 'aceptada' && solicitud.estado !== 'completada') {
      res.status(400).json({
        success: false,
        message: 'Solo puedes agregar evidencias en solicitudes aceptadas'
      });
      return;
    }

    solicitud.evidencias_trabajador = solicitud.evidencias_trabajador || [];
    solicitud.evidencias_trabajador.push(...evidencias);
    await solicitud.save();

    res.json({
      success: true,
      message: 'Evidencias agregadas',
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al agregar evidencias'
    });
  }
};

export const agregarResena = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const { solicitud_id } = req.params;
    const { calificacion, comentario, imagenes } = req.body;

    if (!solicitud_id || !calificacion || (calificacion < 1 || calificacion > 5)) {
      res.status(400).json({
        success: false,
        message: 'solicitud_id y calificación (1-5) son requeridos'
      });
      return;
    }

    const solicitud = await Solicitud.findById(solicitud_id);
    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    // Solo el cliente puede hacer reseña
    if (solicitud.cliente_id.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Solo el cliente puede dejar reseña'
      });
      return;
    }

    if (solicitud.estado !== 'completada') {
      res.status(400).json({
        success: false,
        message: 'La solicitud debe estar completada para dejar reseña'
      });
      return;
    }

    solicitud.calificacion = calificacion;
    solicitud.comentario_calificacion = comentario || '';
    solicitud.imagenes_reseña = Array.isArray(imagenes) ? imagenes : [];
    await solicitud.save();

    res.json({
      success: true,
      message: 'Reseña agregada',
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al agregar reseña'
    });
  }
};
