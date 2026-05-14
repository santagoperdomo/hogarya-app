import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import trabajadoresRoutes from './routes/trabajadores.routes.js';
import reseñasRoutes from './routes/reseñas.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import { uploadMiddleware } from './controllers/solicitudes.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

// Cuando la app corre detrás de un proxy (DigitalOcean, Vercel, etc.)
// necesitamos confiar en el proxy para leer correctamente X-Forwarded-For.
app.enable('trust proxy');

// Configuración de seguridad
app.use(helmet()); // Headers de seguridad

// Rate limiting: limita solicitudes por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configurado para producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://hogarya.me'
    : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // Limita tamaño de payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(publicPath));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/trabajadores', trabajadoresRoutes);
app.use('/api/reseñas', reseñasRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
