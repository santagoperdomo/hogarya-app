import { Request, Response } from 'express';
import Trabajador from '../models/Trabajador';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllTrabajadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const trabajadores = await Trabajador.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trabajadores
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener trabajadores'
    });
  }
};

export const getTrabajadorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trabajador = await Trabajador.findById(id);
    if (!trabajador) {
      res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: trabajador
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener trabajador'
    });
  }
};

export const updateTrabajador = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { servicios, descripcion, telefono, disponible } = req.body;

    const trabajador = await Trabajador.findById(id);
    if (!trabajador) {
      res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
      return;
    }

    if (req.user && trabajador.user_id.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este perfil'
      });
      return;
    }

    if (servicios !== undefined) trabajador.servicios = servicios;
    if (descripcion !== undefined) trabajador.descripcion = descripcion;
    if (telefono !== undefined) trabajador.telefono = telefono;
    if (disponible !== undefined) trabajador.disponible = disponible;

    await trabajador.save();

    res.json({
      success: true,
      data: trabajador
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar trabajador'
    });
  }
};

export const searchTrabajadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.params;

    const trabajadores = await Trabajador.find({
      $or: [
        { nombre: { $regex: query, $options: 'i' } },
        { servicios: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trabajadores
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar trabajadores'
    });
  }
};

export const getMisDatos = async (req: AuthRequest, res: Response): Promise<void> => {
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
        message: 'Trabajador no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: trabajador
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener datos del trabajador'
    });
  }
};
