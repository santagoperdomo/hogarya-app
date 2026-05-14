import { Request, Response } from 'express';
import Solicitud from '../models/Solicitud';
import { AuthRequest } from '../middleware/auth.middleware';

export const enviarMensaje = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const { solicitud_id, mensaje } = req.body;

    if (!solicitud_id || !mensaje) {
      res.status(400).json({
        success: false,
        message: 'solicitud_id y mensaje son requeridos'
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

    // Verificar que el usuario es cliente o trabajador de la solicitud
    const esCliente = solicitud.cliente_id.toString() === req.user.id;
    const esTrabajador = solicitud.trabajador_id.toString() === req.user.id;

    if (!esCliente && !esTrabajador) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este chat'
      });
      return;
    }

    // Solo permitir chat si la solicitud está aceptada
    if (solicitud.estado !== 'aceptada' && solicitud.estado !== 'completada') {
      res.status(400).json({
        success: false,
        message: 'Solo puedes enviar mensajes en solicitudes aceptadas'
      });
      return;
    }

    const remitente = esCliente ? 'cliente' : 'trabajador';
    solicitud.mensajes_chat = solicitud.mensajes_chat || [];
    
    solicitud.mensajes_chat.push({
      remitente,
      mensaje,
      timestamp: new Date()
    });

    await solicitud.save();

    res.json({
      success: true,
      message: 'Mensaje enviado',
      data: solicitud
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al enviar mensaje'
    });
  }
};

export const obtenerChat = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // Verificar permiso
    const esCliente = solicitud.cliente_id.toString() === req.user.id;
    const esTrabajador = solicitud.trabajador_id.toString() === req.user.id;

    if (!esCliente && !esTrabajador) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este chat'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        solicitud_id: solicitud._id,
        mensajes: solicitud.mensajes_chat || [],
        estado: solicitud.estado,
        servicio: solicitud.servicio,
        descripcion: solicitud.descripcion
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener chat'
    });
  }
};
