import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Trabajador from '../models/Trabajador';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password, nombre, tipo, telefono } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password || !nombre || !tipo) {
      res.status(400).json({
        success: false,
        message: 'Email, contraseña, nombre y tipo son requeridos'
      });
      return;
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
      return;
    }

    const usuario = await Usuario.create({
      email,
      password,
      nombre,
      tipo,
      telefono
    });

    if (tipo === 'trabajador') {
      await Trabajador.create({
        user_id: usuario._id,
        nombre,
        telefono: telefono || '',
        servicios: [],
        descripcion: '',
        disponible: true,
        calificacion: 5.0,
        numReseñas: 0
      });
    }

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al registrar usuario'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
      return;
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    const passwordValido = await usuario.comparePassword(password);
    if (!passwordValido) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    const token = generateToken({
      id: usuario._id.toString(),
      email: usuario.email,
      tipo: usuario.tipo
    });

    res.json({
      success: true,
      access_token: token,
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
      message: error.message || 'Error al iniciar sesión'
    });
  }
};

export const getSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
      return;
    }

    const usuario = await Usuario.findById(req.user.id).select('-password');
    if (!usuario) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

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
      message: error.message || 'Error al obtener sesión'
    });
  }
};
