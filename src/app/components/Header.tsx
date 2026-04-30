import { useNavigate } from 'react-router';
import { Home, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '../utils/api';
import { toast } from 'sonner';

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const currentUser = user || auth.getCurrentUser();

  const handleLogout = () => {
    auth.logout();
    toast.success('Sesión cerrada');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const handleDashboard = () => {
    if (currentUser?.tipo === 'trabajador') {
      navigate('/trabajador/dashboard');
    } else if (currentUser?.tipo === 'cliente') {
      navigate('/cliente/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-[#023859] border-b border-[#26658C]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#A7EBF2] to-[#54ACBF] rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-[#023859]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                Hogar<span className="text-[#A7EBF2]">YA</span>
              </span>
              <span className="text-xs text-[#A7EBF2]/80">Servicios del hogar</span>
            </div>
          </button>

          {/* Navegación */}
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/catalogo')}
              className="text-white hover:bg-[#26658C]/30"
            >
              Catálogo
            </Button>

            {currentUser ? (
              <>
                {currentUser.tipo === 'trabajador' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/trabajador/solicitudes')}
                    className="text-white hover:bg-[#26658C]/30"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Solicitudes
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboard}
                  className="text-white hover:bg-[#26658C]/30"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  {currentUser.nombre}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-white hover:bg-[#26658C]/30"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="bg-[#A7EBF2] text-[#023859] hover:bg-[#54ACBF]"
                >
                  Registrarse
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
