import { Response } from 'express';
import Usuario from '../models/Usuario';
import { AuthRequest } from '../middleware/auth.middleware';

export const updatePerfil = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const { nombre, telefono } = req.body;

    const usuario = await Usuario.findById(req.user.id);
    if (!usuario) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    if (nombre !== undefined) usuario.nombre = nombre;
    if (telefono !== undefined) usuario.telefono = telefono;

    await usuario.save();

    res.json({
      success: true,
      user: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        telefono: usuario.telefono
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar perfil'
    });
  }
};
