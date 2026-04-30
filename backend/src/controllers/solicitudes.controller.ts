import { Response } from 'express';
import Solicitud from '../models/Solicitud';
import Trabajador from '../models/Trabajador';
import Usuario from '../models/Usuario';
import { AuthRequest } from '../middleware/auth.middleware';

export const createSolicitud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trabajador_id, servicio, descripcion, fecha_preferida, direccion } = req.body;

    if (!trabajador_id || !servicio || !descripcion) {
      res.status(400).json({
        success: false,
        message: 'trabajador_id, servicio y descripcion son requeridos'
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

    const solicitud = await Solicitud.create({
      cliente_id: req.user.id,
      trabajador_id,
      servicio,
      descripcion,
      fecha_preferida: fecha_preferida ? new Date(fecha_preferida) : undefined,
      direccion,
      estado: 'pendiente'
    });

    res.status(201).json({
      success: true,
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear solicitud'
    });
  }
};

export const getSolicitudesCliente = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const solicitudes = await Solicitud.find({ cliente_id: req.user.id })
      .populate('trabajador_id', 'nombre telefono servicios')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: solicitudes
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener solicitudes'
    });
  }
};

export const getSolicitudesTrabajador = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const trabajador = await Trabajador.findOne({ user_id: req.user.id });
    if (!trabajador) {
      res.status(404).json({
        success: false,
        message: 'Perfil de trabajador no encontrado'
      });
      return;
    }

    const solicitudes = await Solicitud.find({ trabajador_id: trabajador._id })
      .populate('cliente_id', 'nombre telefono email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: solicitudes
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener solicitudes'
    });
  }
};

export const updateSolicitud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, precio_acordado, notas_trabajador } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    const trabajador = await Trabajador.findOne({ user_id: req.user.id });
    if (!trabajador || solicitud.trabajador_id.toString() !== trabajador._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta solicitud'
      });
      return;
    }

    if (estado !== undefined) solicitud.estado = estado;
    if (precio_acordado !== undefined) solicitud.precio_acordado = precio_acordado;
    if (notas_trabajador !== undefined) solicitud.notas_trabajador = notas_trabajador;

    await solicitud.save();

    res.json({
      success: true,
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar solicitud'
    });
  }
};

export const calificarSolicitud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      res.status(400).json({
        success: false,
        message: 'La calificación debe estar entre 1 y 5'
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

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    if (solicitud.cliente_id.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para calificar esta solicitud'
      });
      return;
    }

    if (solicitud.estado !== 'completada') {
      res.status(400).json({
        success: false,
        message: 'Solo puedes calificar solicitudes completadas'
      });
      return;
    }

    solicitud.calificacion = calificacion;
    solicitud.comentario_calificacion = comentario;
    await solicitud.save();

    const trabajador = await Trabajador.findById(solicitud.trabajador_id);
    if (trabajador) {
      const todasCalificaciones = await Solicitud.find({
        trabajador_id: trabajador._id,
        calificacion: { $exists: true }
      });

      const totalPuntos = todasCalificaciones.reduce((sum, s) => sum + (s.calificacion || 0), 0);
      const nuevaCalificacion = totalPuntos / todasCalificaciones.length;

      trabajador.calificacion = Math.round(nuevaCalificacion * 10) / 10;
      trabajador.numReseñas = todasCalificaciones.length;
      await trabajador.save();
    }

    res.json({
      success: true,
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al calificar solicitud'
    });
  }
};
