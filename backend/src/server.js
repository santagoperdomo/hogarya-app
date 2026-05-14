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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '..', 'public');

// Cuando la app corre detrás de un proxy (DigitalOcean, Vercel, etc.)
// confiar solo en el primer proxy es más seguro que habilitar trust proxy globalmente.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: mongoStatus,
        name: mongoose.connection.name || 'unknown'
      },
      server: {
        port: PORT,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor HogarYa...');
    console.log('📋 Variables de entorno detectadas:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'no definido');
    console.log('  - PORT:', process.env.PORT || '5000 (default)');
    console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'definida' : 'no definida');
    console.log('  - MONGO_URI:', process.env.MONGO_URI ? 'definida' : 'no definida');
    console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? 'definida' : 'no definida');
    console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'definida' : 'no definida');
    console.log('  - FRONTEND_URL:', process.env.FRONTEND_URL || 'no definida');

    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
