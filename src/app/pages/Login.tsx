import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth } from '../utils/api';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await auth.login(email.trim().toLowerCase(), password);
      
      if (response.success) {
        toast.success('¡Bienvenido!');
        // Redirigir directamente al catálogo
        navigate('/catalogo');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
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
            Bienvenido de vuelta
          </h1>
          
          <p className="text-lg text-white/80 mb-8">
            Conecta con miles de profesionales verificados en Barranquilla
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="font-semibold text-white">2,400+ profesionales</p>
                <p className="text-sm text-white/60">Verificados y listos para ayudarte</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="font-semibold text-white">Calificación 4.8/5</p>
                <p className="text-sm text-white/60">Miles de clientes satisfechos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 235, 242, 0.2)' }}>
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="font-semibold text-white">Respuesta en 45min</p>
                <p className="text-sm text-white/60">Atención rápida garantizada</p>
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
              Iniciar sesión
            </h2>
            <p className="text-gray-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-2 block font-semibold" style={{ color: '#011C40' }}>
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password" className="font-semibold" style={{ color: '#011C40' }}>
                  Contraseña
                </Label>
                <a href="#" className="text-sm font-medium" style={{ color: '#54ACBF' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-2 border-gray-200 focus:border-[#54ACBF] rounded-xl h-12"
              />
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
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-semibold hover:underline"
                style={{ color: '#54ACBF' }}
              >
                Regístrate gratis
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