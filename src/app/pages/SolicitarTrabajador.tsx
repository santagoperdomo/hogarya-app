import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export default function SolicitarTrabajador() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicios: '',
    experiencia: '',
    mensaje: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En una app real, esto enviaría los datos a un servidor
    console.log('Solicitud de trabajador:', formData);
    
    setSubmitted(true);
    toast.success('¡Solicitud enviada!');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#54ACBF' }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            ¡Gracias por tu interés!
          </h1>
          
          <p className="text-xl mb-8" style={{ color: '#A7EBF2' }}>
            Hemos recibido tu solicitud para ser trabajador en HogarYa.
            Nuestro equipo la revisará y te contactaremos pronto.
          </p>

          <div
            className="rounded-2xl p-6 mb-8"
            style={{ backgroundColor: '#023859' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Próximos pasos:
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  1
                </div>
                <div>
                  <p className="text-white font-semibold">Revisión de solicitud</p>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Verificaremos tu información en 1-2 días hábiles
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  2
                </div>
                <div>
                  <p className="text-white font-semibold">Contacto por teléfono</p>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Te llamaremos al {formData.telefono} para confirmar detalles
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  3
                </div>
                <div>
                  <p className="text-white font-semibold">Activación de cuenta</p>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Crearemos tu perfil de trabajador verificado
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              style={{ backgroundColor: '#54ACBF', color: 'white' }}
            >
              Volver al inicio
            </Button>
            
            <Button
              onClick={() => navigate('/catalogo')}
              size="lg"
              variant="outline"
              className="border-white/20"
              style={{ color: '#A7EBF2' }}
            >
              Ver catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#011C40' }}>
      {/* Header */}
      <header className="border-b shadow-sm" style={{ backgroundColor: '#011C40', borderColor: '#26658C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Home className="w-7 h-7" style={{ color: '#A7EBF2' }} />
              <span className="text-2xl font-bold text-white">HogarYa</span>
            </div>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Lado izquierdo - Información */}
          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
                ¡EMPIEZA HOY!
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Soluciona cualquier problema en tu <span style={{ color: '#A7EBF2' }}>hogar hoy mismo</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Más de 2,400 profesionales verificados en Barranquilla listos para atenderte. Primera consulta gratis.
              </p>
            </div>

            {/* Beneficios */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#54ACBF' }}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Profesionales verificados con antecedentes</p>
                  <p className="text-sm text-white/60">Cada trabajador pasa por un riguroso proceso de verificación</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#54ACBF' }}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Respuesta en menos de 45 minutos</p>
                  <p className="text-sm text-white/60">Obtén respuestas rápidas de profesionales disponibles</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#54ACBF' }}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Pago seguro - sólo pagas cuando termina</p>
                  <p className="text-sm text-white/60">Sin anticipos ni cobros ocultos</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#54ACBF' }}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Garantía de satisfacción del 100%</p>
                  <p className="text-sm text-white/60">Tu tranquilidad es nuestra prioridad</p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div>
                <div className="text-3xl font-bold text-white">18,000+</div>
                <div className="text-sm" style={{ color: '#A7EBF2' }}>servicios realizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.8★</div>
                <div className="text-sm" style={{ color: '#A7EBF2' }}>calificación promedio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">2,400+</div>
                <div className="text-sm" style={{ color: '#A7EBF2' }}>profesionales activos</div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Formulario */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:sticky lg:top-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#011C40' }}>
                Solicitar servicio
              </h2>
              <p className="text-gray-600">
                Cuéntanos qué necesitas y te conectaremos con el experto ideal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="nombre" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                  NOMBRE / EMPRESA *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: María Gómez"
                  required
                  className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="telefono" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                  TELÉFONO / WHATSAPP *
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="+57 300 123 4567"
                  required
                  className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="servicios" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                  TIPO DE SERVICIO *
                </Label>
                <select
                  id="servicios"
                  value={formData.servicios}
                  onChange={(e) => handleChange('servicios', e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12 px-3 bg-white text-gray-900"
                  style={{ outline: 'none' }}
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="Plomería">Plomería</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Carpintería">Carpintería</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Mudanzas">Mudanzas</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Jardinería">Jardinería</option>
                  <option value="Reparaciones">Reparaciones</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <Label htmlFor="mensaje" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                  DESCRIBE TU NECESIDAD *
                </Label>
                <Textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => handleChange('mensaje', e.target.value)}
                  placeholder="Ej: Tengo una gotera en el baño y necesito que la reparen hoy si es posible. También hay que revisar una tubería."
                  required
                  className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl min-h-[120px] resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold text-base rounded-xl h-14 shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: '#54ACBF', color: 'white' }}
              >
                Solicitar ahora →
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Al continuar aceptas nuestros{' '}
                <a href="#" className="underline" style={{ color: '#54ACBF' }}>Términos y condiciones</a>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}