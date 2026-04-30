import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { auth } from '../utils/api';
import { toast } from 'sonner';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    tipo: 'cliente' as 'cliente' | 'trabajador',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await auth.signup(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.nombre,
        formData.tipo,
        formData.telefono
      );

      if (response.success) {
        toast.success('¡Cuenta creada exitosamente!');
        // Auto-login después del registro
        await auth.login(formData.email, formData.password);
        toast.success('¡Bienvenido a HogarYa!');

        // Si es trabajador, ir al onboarding; si es cliente, ir al catálogo
        if (formData.tipo === 'trabajador') {
          navigate('/trabajador/onboarding');
        } else {
          navigate('/catalogo');
        }
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast.error(error.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-md">
          <div className="flex items-center space-x-2 mb-8">
            <Home className="w-10 h-10" style={{ color: '#A7EBF2' }} />
            <span className="text-3xl font-bold text-white">HogarYa</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            Únete a nuestra comunidad
          </h1>
          
          <p className="text-lg text-white/80 mb-8">
            Más de 18,000 hogares confían en HogarYa para sus necesidades del hogar
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <p className="font-semibold text-white">Registro gratuito</p>
                <p className="text-sm text-white/60">Crea tu cuenta en menos de 2 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="font-semibold text-white">100% seguro</p>
                <p className="text-sm text-white/60">Tus datos protegidos siempre</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <p className="font-semibold text-white">Sin comisiones ocultas</p>
                <p className="text-sm text-white/60">Transparencia total en cada servicio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Home className="w-8 h-8" style={{ color: '#54ACBF' }} />
              <span className="text-2xl font-bold" style={{ color: '#011C40' }}>HogarYa</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#011C40' }}>
              Crear cuenta
            </h2>
            <p className="text-gray-600">
              Completa el formulario para empezar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="nombre" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Juan Pérez"
                required
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="tu@email.com"
                required
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
            </div>

            <div>
              <Label htmlFor="telefono" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                Teléfono / WhatsApp
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+57 300 123 4567"
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <Label className="mb-3 block font-semibold" style={{ color: '#011C40' }}>
                Tipo de cuenta
              </Label>
              <RadioGroup
                value={formData.tipo}
                onValueChange={(value) => handleChange('tipo', value)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="cliente"
                    id="cliente"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="cliente"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:border-[#54ACBF] peer-data-[state=checked]:border-[#54ACBF] peer-data-[state=checked]:bg-[#F0F9FF] transition-all"
                  >
                    <span className="text-2xl mb-2">👤</span>
                    <span className="font-semibold" style={{ color: '#011C40' }}>Cliente</span>
                    <span className="text-xs text-gray-500 text-center mt-1">Busco servicios</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="trabajador"
                    id="trabajador"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="trabajador"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:border-[#54ACBF] peer-data-[state=checked]:border-[#54ACBF] peer-data-[state=checked]:bg-[#F0F9FF] transition-all"
                  >
                    <span className="text-2xl mb-2">🔧</span>
                    <span className="font-semibold" style={{ color: '#011C40' }}>Trabajador</span>
                    <span className="text-xs text-gray-500 text-center mt-1">Ofrezco servicios</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full font-bold text-base rounded-xl h-14 shadow-lg hover:shadow-xl transition-all"
              size="lg"
              disabled={loading}
              style={{ 
                backgroundColor: '#54ACBF',
                color: 'white'
              }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="underline" style={{ color: '#54ACBF' }}>Términos y condiciones</a>
              {' '}y{' '}
              <a href="#" className="underline" style={{ color: '#54ACBF' }}>Política de privacidad</a>
            </p>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:underline"
                style={{ color: '#54ACBF' }}
              >
                Inicia sesión
              </button>
            </p>
          </div>

          {/* Volver al inicio */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}