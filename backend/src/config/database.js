import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

    console.log('🔍 Intentando conectar a MongoDB...');
    console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
    console.log('📍 URI encontrada:', mongoURI ? 'Sí' : 'No');

    if (!mongoURI) {
      console.error('❌ Error: MONGODB_URI / MONGO_URI / DATABASE_URL no están definidas en las variables de entorno');
      throw new Error('MONGODB_URI / MONGO_URI / DATABASE_URL no están definidas en las variables de entorno');
    }

    // Log de la URI (sin mostrar la contraseña)
    const uriForLog = mongoURI.replace(/:([^:@]{4})[^:@]*@/, ':****@');
    console.log('🔗 URI de conexión:', uriForLog);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      socketTimeoutMS: 45000, // Timeout de socket
      maxPoolSize: 10, // Máximo de conexiones
      serverSelectionTimeoutMS: 5000,
      family: 4 // IPv4
    });

    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    console.error('🔍 Detalles del error:', error);

    // Si es un error de conexión, dar más información
    if (error.name === 'MongoNetworkError') {
      console.error('💡 Posible causa: Problema de red o firewall bloqueando la conexión a MongoDB Atlas');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Posible causa: No se puede conectar al servidor MongoDB (verificar URI y whitelist IP)');
    } else if (error.name === 'AuthenticationFailed') {
      console.error('💡 Posible causa: Credenciales incorrectas en la URI de MongoDB');
    }

    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});
