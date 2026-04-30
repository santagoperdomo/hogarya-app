import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import Usuario from '../models/Usuario';
import Trabajador from '../models/Trabajador';
import Reseña from '../models/Reseña';

dotenv.config();

const trabajadoresData = [
  {
    email: 'carlos.martinez@hogarya.com',
    password: 'password123',
    nombre: 'Carlos Martínez',
    telefono: '300-123-4567',
    servicios: ['Plomería', 'Electricidad'],
    descripcion: 'Plomero y electricista certificado con más de 10 años de experiencia. Especializado en reparaciones residenciales y comerciales.',
    calificacion: 4.8,
    numReseñas: 24,
    disponible: true
  },
  {
    email: 'maria.gonzalez@hogarya.com',
    password: 'password123',
    nombre: 'María González',
    telefono: '301-234-5678',
    servicios: ['Limpieza', 'Organización'],
    descripcion: 'Servicio profesional de limpieza y organización del hogar. Atención al detalle y productos eco-friendly.',
    calificacion: 5.0,
    numReseñas: 45,
    disponible: true
  },
  {
    email: 'jose.ramirez@hogarya.com',
    password: 'password123',
    nombre: 'José Ramírez',
    telefono: '302-345-6789',
    servicios: ['Carpintería', 'Reparaciones'],
    descripcion: 'Carpintero experto en muebles a medida, reparaciones de puertas, ventanas y todo tipo de trabajos en madera.',
    calificacion: 4.5,
    numReseñas: 18,
    disponible: true
  },
  {
    email: 'ana.lopez@hogarya.com',
    password: 'password123',
    nombre: 'Ana López',
    telefono: '303-456-7890',
    servicios: ['Pintura', 'Decoración'],
    descripcion: 'Pintora profesional con ojo artístico. Transformo espacios con color y estilo. Consultorías de decoración incluidas.',
    calificacion: 4.9,
    numReseñas: 32,
    disponible: true
  },
  {
    email: 'pedro.suarez@hogarya.com',
    password: 'password123',
    nombre: 'Pedro Suárez',
    telefono: '304-567-8901',
    servicios: ['Mudanzas', 'Transporte'],
    descripcion: 'Servicio de mudanzas confiable y cuidadoso. Equipo profesional y vehículos asegurados para tu tranquilidad.',
    calificacion: 4.6,
    numReseñas: 28,
    disponible: false
  },
  {
    email: 'laura.diaz@hogarya.com',
    password: 'password123',
    nombre: 'Laura Díaz',
    telefono: '305-678-9012',
    servicios: ['Jardinería', 'Paisajismo'],
    descripcion: 'Diseño y mantenimiento de jardines. Especialista en plantas tropicales y diseño de espacios verdes sostenibles.',
    calificacion: 4.7,
    numReseñas: 21,
    disponible: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    await connectDB();

    console.log('🗑️  Limpiando datos existentes...');
    await Usuario.deleteMany({});
    await Trabajador.deleteMany({});
    await Reseña.deleteMany({});

    console.log('👥 Creando trabajadores...');

    for (const data of trabajadoresData) {
      const usuario = await Usuario.create({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        tipo: 'trabajador',
        telefono: data.telefono
      });

      await Trabajador.create({
        user_id: usuario._id,
        nombre: data.nombre,
        telefono: data.telefono,
        servicios: data.servicios,
        descripcion: data.descripcion,
        disponible: data.disponible,
        calificacion: data.calificacion,
        numReseñas: data.numReseñas
      });

      console.log(`  ✓ ${data.nombre} creado`);
    }

    console.log('👤 Creando usuario cliente de prueba...');
    await Usuario.create({
      email: 'cliente@hogarya.com',
      password: 'password123',
      nombre: 'Cliente Prueba',
      tipo: 'cliente',
      telefono: '300-000-0000'
    });
    console.log('  ✓ cliente@hogarya.com creado');

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📝 Credenciales de prueba:');
    console.log('   Cliente: cliente@hogarya.com / password123');
    console.log('   Trabajador: carlos.martinez@hogarya.com / password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();
