import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, LogOut, Edit, Star, CheckCircle, XCircle, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { auth, trabajadores, reseñas, solicitudes } from '../utils/api';
import { toast } from 'sonner';

export default function TrabajadorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [trabajador, setTrabajador] = useState<any>(null);
  const [misReseñas, setMisReseñas] = useState<any[]>([]);
  const [misSolicitudes, setMisSolicitudes] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    servicios: [] as string[],
    descripcion: '',
    telefono: '',
    disponible: true,
  });
  const [nuevoServicio, setNuevoServicio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.tipo !== 'trabajador') {
      navigate('/cliente/dashboard');
      return;
    }

    setUser(currentUser);
    loadTrabajadorData(currentUser.id);
    loadReseñas(currentUser.id);
    loadSolicitudes();
  }, [navigate]);

  const loadTrabajadorData = async (id: string) => {
    try {
      const response = await trabajadores.getById(id);
      if (response?.success) {
        setTrabajador(response.trabajador);
        setFormData({
          servicios: response.trabajador.servicios || [],
          descripcion: response.trabajador.descripcion || '',
          telefono: response.trabajador.telefono || '',
          disponible: response.trabajador.disponible ?? true,
        });
      }
    } catch (error: any) {
      console.error('Error cargando datos de trabajador:', error);
    }
  };

  const loadReseñas = async (id: string) => {
    try {
      const response = await reseñas.getByTrabajador(id);
      if (response?.success) {
        setMisReseñas(response.reseñas || []);
      }
    } catch (error: any) {
      console.error('Error cargando reseñas:', error);
    }
  };

  const loadSolicitudes = async () => {
    try {
      const response = await solicitudes.getTrabajador();
      if (response?.success) {
        setMisSolicitudes(response.solicitudes || []);
      }
    } catch (error: any) {
      console.error('Error cargando solicitudes:', error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await trabajadores.update(user.id, formData);
      
      if (response?.success) {
        setTrabajador(response.trabajador);
        setEditing(false);
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('No se pudo actualizar el perfil. Intenta nuevamente.');
      }
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      toast.error(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddServicio = () => {
    if (nuevoServicio.trim() && !formData.servicios.includes(nuevoServicio.trim())) {
      setFormData({
        ...formData,
        servicios: [...formData.servicios, nuevoServicio.trim()],
      });
      setNuevoServicio('');
    }
  };

  const handleRemoveServicio = (servicio: string) => {
    setFormData({
      ...formData,
      servicios: formData.servicios.filter(s => s !== servicio),
    });
  };

  if (!user || !trabajador) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#011C40' }}>
        <div className="text-white">Cargando...</div>
      </div>
    );
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida y estadísticas */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de Trabajador
          </h1>
          <p className="text-lg" style={{ color: '#A7EBF2' }}>
            Hola, {user.nombre}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card style={{ backgroundColor: '#023859', border: 'none' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Calificación
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {trabajador.calificacion?.toFixed(1) || '5.0'}
                  </p>
                </div>
                <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#023859', border: 'none' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Reseñas
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {trabajador.numReseñas || 0}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10" style={{ color: '#A7EBF2' }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#023859', border: 'none' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Estado
                  </p>
                  <p className="text-xl font-bold text-white">
                    {trabajador.disponible ? 'Disponible' : 'Ocupado'}
                  </p>
                </div>
                {trabajador.disponible ? (
                  <CheckCircle className="w-10 h-10 text-green-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card style={{ backgroundColor: '#023859', border: 'none' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Servicios realizados
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {misSolicitudes.filter(s => s.estado === 'completada').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#023859', border: 'none' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#A7EBF2' }}>
                    Solicitudes pendientes
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {misSolicitudes.filter(s => s.estado === 'pendiente').length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-[#A7EBF2]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil profesional */}
          <div className="lg:col-span-2 space-y-6">
            <Card style={{ backgroundColor: '#023859', border: 'none' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-2xl">
                    Perfil Profesional
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
                  Administra tu información profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Disponibilidad */}
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#26658C' }}>
                  <div>
                    <Label className="text-white text-lg">Estado de disponibilidad</Label>
                    <p className="text-sm mt-1" style={{ color: '#A7EBF2' }}>
                      {editing ? 'Cambia tu disponibilidad' : (trabajador.disponible ? 'Apareces en el catálogo' : 'No apareces en el catálogo')}
                    </p>
                  </div>
                  {editing ? (
                    <Switch
                      checked={formData.disponible}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, disponible: checked })
                      }
                    />
                  ) : (
                    <Switch checked={trabajador.disponible} disabled />
                  )}
                </div>

                {/* Servicios */}
                <div>
                  <Label className="text-white mb-2 block">Servicios que ofreces</Label>
                  {editing ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.servicios.map((servicio, idx) => (
                          <Badge
                            key={idx}
                            className="text-sm px-3 py-1"
                            style={{ backgroundColor: '#54ACBF', color: 'white' }}
                          >
                            {servicio}
                            <button
                              onClick={() => handleRemoveServicio(servicio)}
                              className="ml-2 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={nuevoServicio}
                          onChange={(e) => setNuevoServicio(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddServicio()}
                          placeholder="Ej: Plomería"
                          className="bg-white/10 border-white/20 text-white"
                        />
                        <Button
                          onClick={handleAddServicio}
                          type="button"
                          style={{ backgroundColor: '#54ACBF', color: 'white' }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {trabajador.servicios?.length > 0 ? (
                        trabajador.servicios.map((servicio: string, idx: number) => (
                          <Badge
                            key={idx}
                            style={{ backgroundColor: '#54ACBF', color: 'white' }}
                          >
                            {servicio}
                          </Badge>
                        ))
                      ) : (
                        <p style={{ color: '#A7EBF2' }}>No hay servicios configurados</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <Label className="text-white mb-2 block">Descripción</Label>
                  {editing ? (
                    <Textarea
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({ ...formData, descripcion: e.target.value })
                      }
                      placeholder="Describe tu experiencia y servicios..."
                      className="bg-white/10 border-white/20 text-white min-h-[100px]"
                    />
                  ) : (
                    <p style={{ color: '#A7EBF2' }}>
                      {trabajador.descripcion || 'Sin descripción'}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <Label className="text-white mb-2 block">Teléfono de contacto</Label>
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
                    <p style={{ color: '#A7EBF2' }}>
                      {trabajador.telefono || 'No especificado'}
                    </p>
                  )}
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
                          servicios: trabajador.servicios || [],
                          descripcion: trabajador.descripcion || '',
                          telefono: trabajador.telefono || '',
                          disponible: trabajador.disponible ?? true,
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

            {/* Reseñas */}
            <Card style={{ backgroundColor: '#023859', border: 'none' }}>
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Reseñas de clientes
                </CardTitle>
                <CardDescription style={{ color: '#A7EBF2' }}>
                  {misReseñas.length} reseñas recibidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {misReseñas.length === 0 ? (
                  <p style={{ color: '#A7EBF2' }}>
                    Aún no tienes reseñas
                  </p>
                ) : (
                  <div className="space-y-4">
                    {misReseñas.slice(0, 5).map((reseña) => (
                      <div
                        key={reseña.id}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: '#26658C' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white">
                            {reseña.cliente_nombre}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-white">
                              {reseña.puntuacion}
                            </span>
                          </div>
                        </div>
                        {reseña.comentario && (
                          <p className="text-sm" style={{ color: '#A7EBF2' }}>
                            "{reseña.comentario}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <div className="space-y-6">
            <Card style={{ backgroundColor: '#023859', border: 'none' }}>
              <CardHeader>
                <CardTitle className="text-white">Consejos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm" style={{ color: '#A7EBF2' }}>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Mantén tu perfil actualizado</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Responde rápido a los clientes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Ofrece un servicio de calidad</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Pide reseñas a tus clientes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: '#26658C', border: 'none' }}>
              <CardContent className="pt-6">
                <h3 className="font-bold text-white mb-3">
                  Vista previa
                </h3>
                <p className="text-sm mb-4" style={{ color: '#A7EBF2' }}>
                  Así te ven los clientes en el catálogo
                </p>
                <Button
                  onClick={() => navigate('/catalogo')}
                  className="w-full"
                  style={{ backgroundColor: '#54ACBF', color: 'white' }}
                >
                  Ver catálogo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
