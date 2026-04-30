import { useNavigate } from 'react-router';
import { CheckCircle, Home, Users, Shield, Search, Wrench, Sparkles, ArrowRight, Zap, Star, DollarSign, Clock, Award, MessageCircle, Droplet, Sofa, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { auth } from '../utils/api';

export default function Landing() {
  const navigate = useNavigate();

  const servicios = [
    { 
      icon: Wrench, 
      nombre: 'Reparaciones', 
      descripcion: 'Grifos, puertas, ventanas, pisos y todo tipo de arreglos del hogar.',   
    },
    { 
      icon: Users, 
      nombre: 'Mudanzas', 
      descripcion: 'Traslados locales y nacionales con personal capacitado y seguro.',
    },
    { 
      icon: Sofa, 
      nombre: 'Armado de muebles', 
      descripcion: 'Ensamble de todo tipo de muebles, estanterías y más.',
    },
    { 
      icon: Zap, 
      nombre: 'Electricidad', 
      descripcion: 'Instalaciones, reparaciones eléctricas y certificaciones.',
    },
    { 
      icon: Droplet, 
      nombre: 'Plomería', 
      descripcion: 'Tuberías, filtraciones, instalación de baños y cocinas.',
    },
  ];

  const pasos = [
    { 
      icon: Search, 
      titulo: 'Describe tu necesidad', 
      descripcion: 'Cuéntanos qué necesitas. Usa el formulario, tipo de servicio, atención y ubicación en minutos.'
    },
    { 
      icon: Users, 
      titulo: 'Encuentra un experto', 
      descripcion: 'Te mostramos profesionales verificados cerca de ti con disponibilidad inmediata.'
    },
    { 
      icon: MessageCircle, 
      titulo: 'Agenda el servicio', 
      descripcion: 'Elige al profesional, contacta su teléfono y realiza el pago de forma segura cuando termina.'
    },
    { 
      icon: CheckCircle, 
      titulo: 'Recibe ayuda en casa', 
      descripcion: 'El profesional llega a tu hogar en el horario. Califica tu trabajo.'
    },
  ];

  const estadisticas = [
    { icon: CheckCircle, valor: '100%', label: 'Trabajadores verificados', descripcion: 'Cada profesional pasa por un proceso de verificación de identidad, antecedentes y habilidades.' },
    { icon: Star, valor: '4.8/5', label: 'Calificaciones reales', descripcion: 'Todas las calificaciones son otorgadas por clientes reales luego de recibir el servicio.' },
    { icon: DollarSign, valor: '$0', label: 'Pago seguro', descripcion: 'No debes dar anticipos ni pagar por usar la plataforma, únicamente pagas al final.' },
    { icon: Clock, valor: '45min', label: 'Atención rápida', descripcion: 'Tiempo promedio de respuesta de un experto. Algo urgente? Marca como urgente al pedir.' },
  ];

  const currentUser = auth.getCurrentUser();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header   className="sticky top-0 z-50 border-b"
  style={{ backgroundColor: '#011C40', borderColor: '#26658C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Home className="w-7 h-7" style={{ color: '#A7EBF2' }} />
              <span className="text-2xl font-bold text-white">HogarYa</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#servicios" className="text-white/80 hover:text-white transition-colors">Servicios</a>
              <a href="#como-funciona" className="text-white/80 hover:text-white transition-colors">Cómo funciona</a>
              <a href="#profesionales" className="text-white/80 hover:text-white transition-colors">Profesionales</a>
            </nav>
            
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (currentUser.tipo === 'trabajador') {
                        navigate('/trabajador/dashboard');
                      } else {
                        navigate('/cliente/dashboard');
                      }
                    }}
                    className="text-white hover:bg-white/10"
                  >
                    Mi panel
                  </Button>
                  <Button
                    onClick={() => {
                      auth.logout();
                      navigate('/');
                    }}
                    className="font-semibold rounded-full"
                    style={{ 
                      backgroundColor: '#54ACBF',
                      color: 'white'
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-white hover:bg-white/10"
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    onClick={() => navigate('/catalogo')}
                    className="font-semibold rounded-full"
                    style={{ 
                      backgroundColor: '#54ACBF',
                      color: 'white'
                    }}
                  >
                    Solicitar servicio
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold mb-4" style={{ color: '#54ACBF' }}>
                SOLEDAD - BARRANQUILLA 
              </p>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Encuentra ayuda confiable para tu hogar <span style={{ color: '#A7EBF2' }}>en minutos</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8">
                Reparaciones, mudanzas, armado de muebles y más. Profesionales verificados listos para ayudarte hoy.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div>
                  <div className="text-3xl font-bold text-white">0</div>
                  <div className="text-sm" style={{ color: '#A7EBF2' }}>profesionales activos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm" style={{ color: '#A7EBF2' }}>verificados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">45min</div>
                  <div className="text-sm" style={{ color: '#A7EBF2' }}>tiempo promedio</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/catalogo')}
                  size="lg"
                  className="text-base px-8 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: '#54ACBF',
                    color: 'white'
                  }}
                >
                  Solicitar servicio →
                </Button>
                
                <Button
                  onClick={() => {
                    const element = document.getElementById('como-funciona');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  size="lg"
                  variant="outline"
                  className="text-base px-8 font-semibold rounded-full border-2"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    backgroundColor: 'transparent'
                  }}
                >
                  ¿Cómo funciona?
                </Button>
              </div>
            </div>
            
            {/* Image placeholder - using gradient for now */}
            <div className="hidden lg:block relative">
              <div 
                className="rounded-3xl h-96 shadow-2xl overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, #26658C 0%, #54ACBF 100%)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wrench className="w-32 h-32 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              CATEGORÍAS DE SERVICIO
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#011C40' }}>
              Todo lo que tu hogar necesita, <span style={{ color: '#54ACBF' }}>en un solo lugar</span>
            </h2>
            <p className="text-lg text-gray-600">
              Más de 1,200 profesionales verificados en Barranquilla listos para atenderte.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                onClick={() => navigate(`/catalogo?servicio=${encodeURIComponent(servicio.nombre)}`)}
                className="group relative rounded-3xl p-8 transition-all hover:scale-105 cursor-pointer shadow-md hover:shadow-xl"
                style={{
                  backgroundColor: index % 2 === 0 ? '#26658C' : '#023859',
                }}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                    <servicio.icon className="w-8 h-8" style={{ color: '#A7EBF2' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{servicio.nombre}</h3>
                  <p className="text-sm text-white/80">{servicio.descripcion}</p>
                </div>

                <div className="absolute bottom-6 right-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                    style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}
                  >
                    <ArrowRight className="w-5 h-5" style={{ color: '#A7EBF2' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              PROCESO SIMPLE
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#011C40' }}>
              ¿Cómo funciona <span style={{ color: '#54ACBF' }}>HogarYA?</span>
            </h2>
            <p className="text-lg text-gray-600">
              En 4 pasos sencillos llevas a un profesional en tu hogar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {pasos.map((paso, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundColor: '#54ACBF',
                    background: 'linear-gradient(135deg, #54ACBF 0%, #26658C 100%)'
                  }}
                >
                  <paso.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#011C40' }}>{paso.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {paso.descripcion}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigate('/catalogo')}
              size="lg"
              className="text-base px-10 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ 
                backgroundColor: '#54ACBF',
                color: 'white'
              }}
            >
              Comenzar ahora →
            </Button>
          </div>
        </div>
      </section>

      {/* Seguridad Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              POR QUÉ CONFIAR EN NOSOTROS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Tu seguridad es nuestra <span style={{ color: '#A7EBF2' }}>prioridad</span>
            </h2>
            <p className="text-lg text-white/70">
              Conectamos verificados con cada servicio. Más de 18,000 hogares en Barranquilla ya confían.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {estadisticas.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 text-center transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'rgba(38, 101, 140, 0.3)',
                  border: '1px solid rgba(167, 235, 242, 0.1)'
                }}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                  <stat.icon className="w-8 h-8" style={{ color: '#A7EBF2' }} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.valor}</div>
                <div className="text-base font-semibold mb-2" style={{ color: '#A7EBF2' }}>{stat.label}</div>
                <p className="text-sm text-white/60">{stat.descripcion}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Award className="w-5 h-5 mr-2" style={{ color: '#54ACBF' }} />
                <span className="text-lg font-semibold text-white">Mejor app del servicios 2025</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 mr-2" style={{ color: '#54ACBF' }} />
                <span className="text-lg font-semibold text-white">Certificado SSL</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#54ACBF' }} />
                <span className="text-lg font-semibold text-white">+13,400 hogares</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trabajadores destacados */}
      <section id="profesionales" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              NUESTROS PROFESIONALES
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#011C40' }}>
              Conoce a los <span style={{ color: '#54ACBF' }}>mejores expertos</span>
            </h2>
            <p className="text-lg text-gray-600">
              Todos verificados, calificados y listos para atenderte en Barranquilla.
            </p>
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigate('/catalogo')}
              size="lg"
              className="text-base px-10 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ 
                backgroundColor: '#54ACBF',
                color: 'white'
              }}
            >
              Ver todos los profesionales →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              ¡EMPIEZA HOY!
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Soluciona cualquier problema en tu <span style={{ color: '#A7EBF2' }}>hogar hoy mismo</span>
            </h2>
            <p className="text-xl mb-10 text-white/80">
              Más de 2,400 profesionales verificados en Barranquilla listos para atenderte. Primera consulta gratis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                onClick={() => navigate('/catalogo')}
                size="lg"
                className="text-lg px-10 py-6 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all"
                style={{ 
                  backgroundColor: '#54ACBF',
                  color: 'white'
                }}
              >
                Solicitar servicio ahora
              </Button>
              
              <Button
                onClick={() => navigate('/signup')}
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 font-semibold rounded-full border-2"
                style={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              >
                Quiero ser trabajador
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-white/60">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" style={{ color: '#54ACBF' }} />
                Profesionales verificados con antecedentes
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" style={{ color: '#54ACBF' }} />
                Respuesta en menos de 45 minutos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ backgroundColor: '#011C40', borderColor: '#26658C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-6 h-6" style={{ color: '#A7EBF2' }} />
                <span className="text-xl font-bold text-white">HogarYa</span>
              </div>
              <p className="text-sm text-white/60">
                © 2026 HogarYa. Todos los derechos reservados. Barranquilla, Colombia.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Profesionales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <p className="text-sm text-white/60 mb-2">Contact.hogarya@gmail.com</p>
              <p className="text-sm text-white/60">+57 300 123 4567</p>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center" style={{ borderColor: '#26658C' }}>
            <p className="text-sm" style={{ color: '#A7EBF2' }}>
              HogarYa - Conectando hogares con profesionales verificados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}