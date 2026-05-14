import Solicitud from '../models/Solicitud.js';
import Trabajador from '../models/Trabajador.js';
import Usuario from '../models/Usuario.js';
import multer from 'multer';
import path from 'path';

// Helper para saber si el usuario actual es el trabajador asignado a la solicitud
const isTrabajadorAsignado = async (solicitud, userId) => {
  if (!userId || !solicitud || !solicitud.trabajador_id) return false;
  const trabajador = await Trabajador.findOne({ user_id: userId });
  return trabajador && solicitud.trabajador_id.toString() === trabajador._id.toString();
};

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const createSolicitud = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear solicitud'
    });
  }
};

export const getSolicitudesCliente = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener solicitudes'
    });
  }
};

export const getSolicitudesTrabajador = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener solicitudes'
    });
  }
};

export const updateSolicitud = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar solicitud'
    });
  }
};

export const calificarSolicitud = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al calificar solicitud'
    });
  }
};

export const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const solicitud = await Solicitud.findById(id)
      .populate('cliente_id', 'nombre email')
      .populate('trabajador_id', 'nombre especialidad calificacion');

    if (!solicitud) {
      res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
      return;
    }

    // Verificar que el usuario sea cliente o trabajador de la solicitud
    const trabajadorAsignado = await isTrabajadorAsignado(solicitud, req.user.id);
    if (solicitud.cliente_id._id.toString() !== req.user.id && !trabajadorAsignado) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta solicitud'
      });
      return;
    }

    res.json({
      success: true,
      data: solicitud
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener solicitud'
    });
  }
};

export const enviarMensajeChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;

    if (!mensaje || mensaje.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'El mensaje es requerido'
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

    // Verificar que el usuario sea cliente o trabajador de la solicitud
    const trabajadorAsignado = await isTrabajadorAsignado(solicitud, req.user.id);
    if (solicitud.cliente_id.toString() !== req.user.id && !trabajadorAsignado) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para enviar mensajes en esta solicitud'
      });
      return;
    }

    // Determinar si es cliente o trabajador
    const remitente = solicitud.cliente_id.toString() === req.user.id ? 'cliente' : 'trabajador';

    solicitud.mensajes_chat.push({
      remitente,
      mensaje: mensaje.trim(),
      timestamp: new Date()
    });

    await solicitud.save();

    res.json({
      success: true,
      data: solicitud.mensajes_chat[solicitud.mensajes_chat.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al enviar mensaje'
    });
  }
};

export const getMensajesChat = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Verificar que el usuario sea cliente o trabajador de la solicitud
    const trabajadorAsignado = await isTrabajadorAsignado(solicitud, req.user.id);
    if (solicitud.cliente_id.toString() !== req.user.id && !trabajadorAsignado) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los mensajes de esta solicitud'
      });
      return;
    }

    res.json({
      success: true,
      data: solicitud.mensajes_chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener mensajes'
    });
  }
};

export const completarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { evidencias } = req.body; // Array de URLs de evidencias

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

    // Verificar que el usuario sea cliente o trabajador de la solicitud
    const trabajadorAsignado = await isTrabajadorAsignado(solicitud, req.user.id);
    if (solicitud.cliente_id.toString() !== req.user.id && !trabajadorAsignado) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para completar esta solicitud'
      });
      return;
    }

    // Solo permitir completar si está aceptada
    if (solicitud.estado !== 'aceptada') {
      res.status(400).json({
        success: false,
        message: 'Solo puedes completar solicitudes aceptadas'
      });
      return;
    }

    solicitud.estado = 'completada';
    solicitud.fecha_completado = new Date();

    // Si es trabajador asignado, puede agregar evidencias
    if (trabajadorAsignado && evidencias) {
      solicitud.evidencias_trabajador = evidencias;
    }

    await solicitud.save();

    res.json({
      success: true,
      data: solicitud
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al completar solicitud'
    });
  }
};

export const subirEvidencia = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Solo el trabajador asignado puede subir evidencias
    const trabajadorAsignado = await isTrabajadorAsignado(solicitud, req.user.id);
    if (!trabajadorAsignado) {
      res.status(403).json({
        success: false,
        message: 'Solo el trabajador puede subir evidencias'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
      return;
    }

    // Guardar la URL del archivo (en producción usarías cloud storage)
    const evidenciaUrl = `/uploads/${req.file.filename}`;
    solicitud.evidencias_trabajador.push(evidenciaUrl);
    await solicitud.save();

    res.json({
      success: true,
      data: evidenciaUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al subir evidencia'
    });
  }
};

// Middleware para subir archivos
export const uploadMiddleware = upload.single('evidencia');
