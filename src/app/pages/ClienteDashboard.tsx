import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, LogOut, Search, User as UserIcon, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { auth, perfil } from '../utils/api';
import { toast } from 'sonner';

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.tipo !== 'cliente') {
      navigate('/trabajador/dashboard');
      return;
    }

    setUser(currentUser);
    setFormData({
      nombre: currentUser.nombre || '',
      telefono: currentUser.telefono || '',
    });
  }, [navigate]);

  const handleLogout = () => {
    auth.logout();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await perfil.update(formData);
      
      if (response.success) {
        // Actualizar usuario en localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        toast.success('Perfil actualizado correctamente');
      }
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      toast.error(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#011C40' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Home className="w-8 h-8" style={{ color: '#A7EBF2' }} />
              <span className="text-2xl font-bold text-white">HogarYa</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hola, {user.nombre}
          </h1>
          <p className="text-lg" style={{ color: '#A7EBF2' }}>
            Bienvenido a tu panel de cliente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil */}
          <div className="lg:col-span-2">
            <Card style={{ backgroundColor: '#023859', border: 'none' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-2xl">
                    Mi Perfil
                  </CardTitle>
                  {!editing && (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="border-white/20"
                      style={{ color: '#A7EBF2' }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
                <CardDescription style={{ color: '#A7EBF2' }}>
                  Administra tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Nombre</Label>
                  {editing ? (
                    <Input
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-lg" style={{ color: '#A7EBF2' }}>
                      {user.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-white mb-2 block">Email</Label>
                  <p className="text-lg" style={{ color: '#A7EBF2' }}>
                    {user.email}
                  </p>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Teléfono</Label>
                  {editing ? (
                    <Input
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      placeholder="+57 300 123 4567"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-lg" style={{ color: '#A7EBF2' }}>
                      {user.telefono || 'No especificado'}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-white mb-2 block">Tipo de cuenta</Label>
                  <p className="text-lg" style={{ color: '#A7EBF2' }}>
                    Cliente
                  </p>
                </div>

                {editing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      style={{ backgroundColor: '#54ACBF', color: 'white' }}
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          nombre: user.nombre,
                          telefono: user.telefono,
                        });
                      }}
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <div>
            <Card style={{ backgroundColor: '#023859', border: 'none' }}>
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Acciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/catalogo')}
                  className="w-full justify-start font-semibold"
                  size="lg"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Buscar trabajadores
                </Button>

                <Button
                  onClick={() => navigate('/solicitar-trabajador')}
                  variant="outline"
                  className="w-full justify-start border-white/20"
                  size="lg"
                  style={{ color: '#A7EBF2' }}
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Ser trabajador
                </Button>
              </CardContent>
            </Card>

            {/* Información */}
            <Card className="mt-6" style={{ backgroundColor: '#26658C', border: 'none' }}>
              <CardContent className="pt-6">
                <h3 className="font-bold text-white mb-2">
                  ¿Cómo funciona?
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: '#A7EBF2' }}>
                  <li>1. Busca trabajadores por servicio</li>
                  <li>2. Revisa perfiles y calificaciones</li>
                  <li>3. Contacta por WhatsApp o llamada</li>
                  <li>4. Agenda tu servicio directamente</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
