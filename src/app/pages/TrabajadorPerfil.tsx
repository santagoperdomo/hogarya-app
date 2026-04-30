import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Star, Phone, MessageCircle, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';
import SolicitarServicioModal from '../components/SolicitarServicioModal';
import { auth } from '../utils/api';
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

interface Reseña {
  id: string;
  cliente_nombre: string;
  puntuacion: number;
  comentario?: string;
  createdAt: string;
}

export default function TrabajadorPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [trabajador, setTrabajador] = useState<Trabajador | null>(null);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    loadTrabajador();
  }, [id]);

  const loadTrabajador = async () => {
    try {
      setLoading(true);

      // Obtener trabajador
      const response = await fetch(`http://localhost:5000/api/trabajadores/${id}`);
      const data = await response.json();

      if (data.success) {
        // Mapear _id a id
        const trabajadorData = { ...data.data, id: data.data._id };
        setTrabajador(trabajadorData);

        // Obtener reseñas
        const reseñasResponse = await fetch(`http://localhost:5000/api/reseñas/${id}`);
        const reseñasData = await reseñasResponse.json();

        if (reseñasData.success) {
          const reseñasMapped = (reseñasData.data || []).map((r: any) => ({
            ...r,
            id: r._id
          }));
          setReseñas(reseñasMapped);
        }
      }
    } catch (error: any) {
      console.error('Error cargando trabajador:', error);
      toast.error('Error al cargar perfil del trabajador');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!trabajador) return;
    const mensaje = encodeURIComponent(
      `Hola ${trabajador.nombre}, vi tu perfil en HogarYa y me gustaría contactarte para un servicio.`
    );
    window.open(`https://wa.me/${trabajador.telefono.replace(/\D/g, '')}?text=${mensaje}`, '_blank');
  };

  const handleCall = () => {
    if (!trabajador) return;
    window.open(`tel:${trabajador.telefono}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        <Header user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#54ACBF' }}></div>
            <p style={{ color: '#023859' }}>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trabajador) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        <Header user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p style={{ color: '#023859' }}>Trabajador no encontrado</p>
            <Button onClick={() => navigate('/catalogo')} className="mt-4" style={{ backgroundColor: '#54ACBF' }}>
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <Header user={user} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Botón volver */}
        <Button
          variant="ghost"
          onClick={() => navigate('/catalogo')}
          className="mb-6"
          style={{ color: '#023859' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card principal */}
            <Card style={{ backgroundColor: 'white', border: 'none' }} className="shadow-lg">
              <CardContent className="p-8">
                {/* Header del perfil */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                      style={{ backgroundColor: '#54ACBF' }}
                    >
                      {trabajador.nombre.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2" style={{ color: '#011C40' }}>
                        {trabajador.nombre}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-bold" style={{ color: '#023859' }}>
                            {trabajador.calificacion.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-500">({trabajador.numReseñas} reseñas)</span>
                      </div>
                      {trabajador.disponible ? (
                        <Badge className="bg-green-500 text-white">Disponible</Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white">No disponible</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Servicios */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: '#023859' }}>
                    <Briefcase className="w-5 h-5" />
                    Servicios que ofrece
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trabajador.servicios.map((servicio, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="px-3 py-1"
                        style={{ borderColor: '#54ACBF', color: '#023859' }}
                      >
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                {trabajador.descripcion && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#023859' }}>
                      Sobre mí
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{trabajador.descripcion}</p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setShowModal(true)}
                    className="flex-1 font-semibold"
                    size="lg"
                    style={{ backgroundColor: '#54ACBF', color: 'white' }}
                    disabled={!user || !trabajador.disponible}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {!user ? 'Inicia sesión para solicitar' : 'Solicitar servicio'}
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    size="lg"
                    className="border-2"
                    style={{ borderColor: '#25D366', color: '#25D366' }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    size="lg"
                    style={{ borderColor: '#023859', color: '#023859' }}
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reseñas y comentarios */}
            <Card style={{ backgroundColor: 'white', border: 'none' }} className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#011C40' }}>
                  Reseñas ({reseñas.length})
                </h2>

                {reseñas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aún no hay reseñas para este trabajador
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reseñas.map((reseña) => (
                      <div key={reseña.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: '#26658C' }}
                            >
                              {reseña.cliente_nombre.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: '#023859' }}>
                                {reseña.cliente_nombre}
                              </p>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < reseña.puntuacion
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(reseña.createdAt).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        {reseña.comentario && (
                          <p className="text-gray-700 mt-2">{reseña.comentario}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Info de contacto */}
          <div>
            <Card style={{ backgroundColor: '#023859', border: 'none' }} className="shadow-lg sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Información de contacto</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-5 h-5" style={{ color: '#A7EBF2' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#A7EBF2' }}>Teléfono</p>
                      <p className="font-semibold">{trabajador.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Briefcase className="w-5 h-5" style={{ color: '#A7EBF2' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#A7EBF2' }}>Experiencia</p>
                      <p className="font-semibold">{trabajador.numReseñas} trabajos completados</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5" style={{ color: '#A7EBF2' }} />
                    <div>
                      <p className="text-sm" style={{ color: '#A7EBF2' }}>Calificación</p>
                      <p className="font-semibold">{trabajador.calificacion.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(167, 235, 242, 0.1)' }}>
                  <p className="text-sm text-white">
                    <CheckCircle className="w-4 h-4 inline mr-1" style={{ color: '#A7EBF2' }} />
                    Trabajador verificado por HogarYa
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de solicitud */}
      {showModal && user && (
        <SolicitarServicioModal
          trabajador={trabajador}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            toast.success('Solicitud enviada correctamente');
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
