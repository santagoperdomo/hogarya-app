import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Phone, MessageCircle, Star, Home, LogOut, User as UserIcon, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import { trabajadores, auth } from '../utils/api';
import { toast } from 'sonner';

interface Trabajador {
  id: string;
  nombre: string;
  servicios: string[];
  descripcion: string;
  disponible: boolean;
  calificacion: number;
  telefono: string;
  numReseñas: number;
}

export default function Catalogo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allTrabajadores, setAllTrabajadores] = useState<Trabajador[]>([]);
  const [filteredTrabajadores, setFilteredTrabajadores] = useState<Trabajador[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServicio, setSelectedServicio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Cargar usuario actual
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Cargar trabajadores
  useEffect(() => {
    loadTrabajadores();
  }, []);

  // Aplicar filtro desde URL
  useEffect(() => {
    const servicioParam = searchParams.get('servicio');
    if (servicioParam) {
      setSelectedServicio(servicioParam);
      toast.info(`Filtrando por: ${servicioParam}`);
    }
  }, [searchParams]);

  const loadTrabajadores = async () => {
    try {
      setLoading(true);
      const response = await trabajadores.getAll();
      const trabajadoresData = response.trabajadores || [];
      setAllTrabajadores(trabajadoresData);
      setFilteredTrabajadores(trabajadoresData);
    } catch (error: any) {
      console.error('Error cargando trabajadores:', error);
      toast.error('Error al cargar trabajadores. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar trabajadores
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredTrabajadores(allTrabajadores);
      return;
    }

    try {
      const response = await trabajadores.search(searchQuery);
      setFilteredTrabajadores(response.trabajadores || []);
    } catch (error: any) {
      console.error('Error en búsqueda:', error);
      toast.error('Error en la búsqueda');
    }
  };

  // Filtrar por servicio
  useEffect(() => {
    if (!selectedServicio) {
      setFilteredTrabajadores(allTrabajadores);
      return;
    }

    const filtered = allTrabajadores.filter(t =>
      t.servicios.some(s => s.toLowerCase().includes(selectedServicio.toLowerCase()))
    );
    setFilteredTrabajadores(filtered);
  }, [selectedServicio, allTrabajadores]);

  // Obtener servicios únicos
  const serviciosUnicos = Array.from(
    new Set(allTrabajadores.flatMap(t => t.servicios || []))
  );

  const handleLogout = () => {
    auth.logout();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const handleWhatsApp = (telefono: string, nombre: string) => {
    const mensaje = encodeURIComponent(`Hola ${nombre}, vi tu perfil en HogarYa y me gustaría contactarte para un servicio.`);
    window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${mensaje}`, '_blank');
  };

  const handleCall = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <Header user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título y búsqueda */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold mb-3" style={{ color: '#54ACBF' }}>
              NUESTROS PROFESIONALES
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#011C40' }}>
              Conoce a los <span style={{ color: '#54ACBF' }}>mejores expertos</span>
            </h1>
            <p className="text-lg text-gray-600">
              Todos verificados, calificados y listos para atenderte en Barranquilla.
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 bg-white rounded-2xl shadow-lg p-3">
              <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <Input
                  type="text"
                  placeholder="Ej: plomería, electricidad, mudanzas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="px-8 font-semibold rounded-xl"
                style={{ backgroundColor: '#54ACBF', color: 'white' }}
              >
                Buscar
              </Button>
            </div>
          </div>

          {/* Filtros de servicio */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedServicio === '' ? 'default' : 'outline'}
              onClick={() => setSelectedServicio('')}
              className={`rounded-full font-semibold ${selectedServicio === '' ? '' : 'border-2 hover:bg-gray-50'}`}
              style={selectedServicio === '' ? { backgroundColor: '#54ACBF', color: 'white', borderColor: '#54ACBF' } : { borderColor: '#54ACBF', color: '#54ACBF', backgroundColor: 'white' }}
            >
              Todos los servicios
            </Button>
            {serviciosUnicos.map((servicio) => (
              <Button
                key={servicio}
                variant={selectedServicio === servicio ? 'default' : 'outline'}
                onClick={() => setSelectedServicio(servicio)}
                className={`rounded-full font-semibold ${selectedServicio === servicio ? '' : 'border-2 hover:bg-gray-50'}`}
                style={selectedServicio === servicio ? { backgroundColor: '#54ACBF', color: 'white', borderColor: '#54ACBF' } : { borderColor: '#54ACBF', color: '#54ACBF', backgroundColor: 'white' }}
              >
                {servicio}
              </Button>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            {filteredTrabajadores.length} profesional{filteredTrabajadores.length !== 1 ? 'es' : ''} disponible{filteredTrabajadores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de trabajadores */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#54ACBF]"></div>
            <p className="mt-6 text-lg font-medium text-gray-600">Cargando profesionales...</p>
          </div>
        ) : filteredTrabajadores.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F9FF' }}>
              <Search className="w-10 h-10" style={{ color: '#54ACBF' }} />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No se encontraron profesionales</p>
            <p className="text-gray-600">
              Intenta con otra búsqueda o selecciona un servicio diferente
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrabajadores.map((trabajador) => (
              <div
                key={trabajador.id}
                onClick={() => navigate(`/trabajador/${trabajador.id}`)}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Header con imagen/avatar */}
                <div className="relative h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, #26658C 0%, #54ACBF 100%)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl"
                      style={{ backgroundColor: 'white', color: '#54ACBF' }}
                    >
                      {trabajador.nombre.charAt(0)}
                    </div>
                  </div>
                  
                  {trabajador.disponible && (
                    <div className="absolute top-4 right-4">
                      <Badge
                        className="font-semibold px-3 py-1 shadow-lg"
                        style={{ backgroundColor: '#A7EBF2', color: '#011C40' }}
                      >
                        Disponible
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {/* Nombre y calificación */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#011C40' }}>
                      {trabajador.nombre}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(trabajador.calificacion) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm font-semibold ml-2" style={{ color: '#011C40' }}>
                        {trabajador.calificacion.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({trabajador.numReseñas} reseñas)
                      </span>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {trabajador.servicios.map((servicio, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-2 font-medium"
                          style={{ borderColor: '#54ACBF', color: '#54ACBF', backgroundColor: '#F0F9FF' }}
                        >
                          {servicio}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Descripción */}
                  {trabajador.descripcion && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {trabajador.descripcion}
                    </p>
                  )}

                  {/* Precio indicativo */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Desde</p>
                    <p className="text-2xl font-bold" style={{ color: '#54ACBF' }}>$50,000</p>
                  </div>

                  {/* Botón ver perfil */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trabajador/${trabajador.id}`);
                      }}
                      className="flex-1 font-semibold rounded-xl"
                      style={{ backgroundColor: '#54ACBF', color: 'white' }}
                    >
                      Ver perfil completo
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-20 py-16" style={{ backgroundColor: '#011C40' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Cuéntanos qué necesitas y te ayudamos a encontrar al profesional ideal
          </p>
          <Button
            onClick={() => navigate('/solicitar-trabajador')}
            size="lg"
            className="text-base px-10 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: '#54ACBF', color: 'white' }}
          >
            Solicitar un servicio personalizado
          </Button>
        </div>
      </div>
    </div>
  );
}