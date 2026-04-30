import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Briefcase, Star, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { auth, trabajadores } from '../utils/api';
import { toast } from 'sonner';

const SERVICIOS_DISPONIBLES = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Mudanzas',
  'Limpieza',
  'Jardinería',
  'Reparaciones generales',
  'Armado de muebles',
  'Cerrajería',
  'Albañilería',
  'Techos y goteras'
];

export default function TrabajadorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [trabajadorId, setTrabajadorId] = useState<string>('');
  const [formData, setFormData] = useState({
    servicios: [] as string[],
    descripcion: '',
    disponible: true
  });

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.tipo !== 'trabajador') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadTrabajadorId();
  }, [navigate]);

  const loadTrabajadorId = async () => {
    try {
      const response = await trabajadores.getMyData();
      if (response.success && response.trabajador) {
        setTrabajadorId(response.trabajador.id);
      } else {
        console.error('Error cargando trabajador:', response);
      }
    } catch (error) {
      console.error('Error cargando trabajador:', error);
    }
  };

  const toggleServicio = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }));
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (formData.servicios.length === 0) {
        toast.error('Selecciona al menos un servicio');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      if (!trabajadorId) {
        toast.error('No se encontró el perfil del trabajador. Intenta cerrar sesión e iniciar sesión de nuevo.');
        return;
      }

      setLoading(true);

      const data = await trabajadores.update(trabajadorId, formData);

      if (data.success) {
        toast.success('¡Perfil completado! Ya estás listo para recibir solicitudes');
        navigate('/catalogo');
      } else {
        toast.error('Error al actualizar perfil');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/catalogo');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#011C40' }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Home className="w-12 h-12 mr-3" style={{ color: '#A7EBF2' }} />
            <h1 className="text-4xl font-bold text-white">HogarYa</h1>
          </div>
          <div className="inline-block px-6 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: '#A7EBF2' }}>
              Paso {step} de 3
            </p>
          </div>
        </div>

        {/* Contenido por paso */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F9FF' }}>
                <Star className="w-10 h-10" style={{ color: '#54ACBF' }} />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#011C40' }}>
                ¡Bienvenido a HogarYa, {user?.nombre}! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Estamos emocionados de tenerte en nuestra plataforma. En solo 3 pasos configuraremos tu perfil para que empieces a recibir solicitudes de clientes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#54ACBF' }}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#011C40' }}>
                    1. Tus servicios
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecciona los servicios que ofreces para que los clientes te encuentren fácilmente
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#54ACBF' }}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#011C40' }}>
                    2. Tu presentación
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cuéntanos sobre tu experiencia y por qué los clientes deberían elegirte
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#54ACBF' }}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#011C40' }}>
                    3. ¡Listo!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tu perfil estará visible y empezarás a recibir solicitudes de clientes
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-12">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="px-8 font-semibold rounded-xl"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  Comenzar configuración
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="lg"
                  className="px-8 font-semibold rounded-xl"
                  style={{ borderColor: '#54ACBF', color: '#54ACBF' }}
                >
                  Omitir por ahora
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#011C40' }}>
                  ¿Qué servicios ofreces?
                </h2>
                <p className="text-gray-600">
                  Selecciona todos los servicios que puedes realizar. Esto ayudará a los clientes a encontrarte.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {SERVICIOS_DISPONIBLES.map((servicio) => (
                  <button
                    key={servicio}
                    onClick={() => toggleServicio(servicio)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.servicios.includes(servicio)
                        ? 'border-[#54ACBF] bg-[#F0F9FF]'
                        : 'border-gray-200 hover:border-[#54ACBF]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm" style={{ color: '#011C40' }}>
                        {servicio}
                      </span>
                      {formData.servicios.includes(servicio) && (
                        <CheckCircle className="w-5 h-5" style={{ color: '#54ACBF' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl mb-8" style={{ backgroundColor: '#F0F9FF' }}>
                <p className="text-sm font-semibold" style={{ color: '#023859' }}>
                  {formData.servicios.length} servicio{formData.servicios.length !== 1 ? 's' : ''} seleccionado{formData.servicios.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="px-8 font-semibold rounded-xl"
                  style={{ borderColor: '#54ACBF', color: '#54ACBF' }}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="flex-1 px-8 font-semibold rounded-xl"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                  disabled={formData.servicios.length === 0}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#011C40' }}>
                  Cuéntanos sobre ti
                </h2>
                <p className="text-gray-600">
                  Una buena descripción ayuda a los clientes a conocerte y confiar en tus servicios.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <Label className="mb-2 block font-semibold text-base" style={{ color: '#011C40' }}>
                    Descripción profesional
                  </Label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Ejemplo: Soy plomero con 5 años de experiencia. Me especializo en reparaciones de emergencia, instalaciones y mantenimiento preventivo. Trabajo con responsabilidad y garantía en todos mis servicios."
                    rows={6}
                    className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Incluye tu experiencia, especialidades y qué te hace único
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: '#F0F9FF' }}>
                  <h3 className="font-bold mb-3 flex items-center" style={{ color: '#023859' }}>
                    <CheckCircle className="w-5 h-5 mr-2" style={{ color: '#54ACBF' }} />
                    Servicios seleccionados:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.servicios.map((servicio, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-2"
                        style={{ borderColor: '#54ACBF', color: '#023859', backgroundColor: 'white' }}
                      >
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  size="lg"
                  className="px-8 font-semibold rounded-xl"
                  style={{ borderColor: '#54ACBF', color: '#54ACBF' }}
                  disabled={loading}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleFinish}
                  size="lg"
                  className="flex-1 px-8 font-semibold rounded-xl"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : '¡Completar y empezar!'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:soporte@hogarya.com" className="underline" style={{ color: '#A7EBF2' }}>
              soporte@hogarya.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
