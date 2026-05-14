import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MessageCircle, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { solicitudes } from '../utils/api';
import { auth } from '../utils/api';
import { toast } from 'sonner';

interface Solicitud {
  _id: string;
  servicio: string;
  descripcion: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'completada' | 'cancelada';
  fecha_preferida?: string;
  precio_acordado?: number;
  trabajador_id: {
    nombre: string;
    especialidad: string;
    calificacion: number;
  };
  createdAt: string;
  mensajes_chat: any[];
  calificacion?: number;
}

export default function ClienteSolicitudes() {
  const [solicitudesList, setSolicitudesList] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      const response = await solicitudes.getCliente();
      if (response.success) {
        setSolicitudesList(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-500';
      case 'aceptada': return 'bg-green-500';
      case 'rechazada': return 'bg-red-500';
      case 'completada': return 'bg-blue-500';
      case 'cancelada': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'aceptada': return <CheckCircle className="w-4 h-4" />;
      case 'rechazada': return <XCircle className="w-4 h-4" />;
      case 'completada': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'aceptada': return 'Aceptada';
      case 'rechazada': return 'Rechazada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const handleChat = (solicitudId: string) => {
    navigate(`/cliente/solicitudes/${solicitudId}/chat`);
  };

  const handleCompletar = async (solicitudId: string) => {
    try {
      const response = await solicitudes.completar(solicitudId);
      if (response.success) {
        toast.success('Solicitud marcada como completada');
        loadSolicitudes();
      }
    } catch (error) {
      toast.error('Error al completar solicitud');
    }
  };

  const handleCalificar = (solicitudId: string) => {
    navigate(`/cliente/solicitudes/${solicitudId}/calificar`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023859] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#023859] mb-2">Mis Solicitudes</h1>
          <p className="text-gray-600">Gestiona tus solicitudes de servicio</p>
        </div>

        {solicitudesList.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes solicitudes</h3>
              <p className="text-gray-500 mb-4">Cuando solicites un servicio, aparecerá aquí</p>
              <Button onClick={() => navigate('/catalogo')}>
                Explorar catálogo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {solicitudesList.map((solicitud) => (
              <Card key={solicitud._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-[#023859]">{solicitud.servicio}</CardTitle>
                      <p className="text-gray-600 mt-1">{solicitud.descripcion}</p>
                    </div>
                    <Badge className={`${getEstadoColor(solicitud.estado)} text-white flex items-center gap-1`}>
                      {getEstadoIcon(solicitud.estado)}
                      {getEstadoText(solicitud.estado)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-[#023859] mb-2">Trabajador</h4>
                      <p className="text-gray-700">{solicitud.trabajador_id.nombre}</p>
                      <p className="text-gray-600">{solicitud.trabajador_id.especialidad}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">
                          {solicitud.trabajador_id.calificacion || 'Sin calificación'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#023859] mb-2">Detalles</h4>
                      <p className="text-gray-700">
                        Fecha: {solicitud.fecha_preferida ? new Date(solicitud.fecha_preferida).toLocaleDateString() : 'No especificada'}
                      </p>
                      {solicitud.precio_acordado && (
                        <p className="text-gray-700">
                          Precio: ${solicitud.precio_acordado}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">
                        Creada: {new Date(solicitud.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {solicitud.estado === 'aceptada' && (
                      <>
                        <Button
                          onClick={() => handleChat(solicitud._id)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat ({solicitud.mensajes_chat?.length || 0})
                        </Button>
                        <Button
                          onClick={() => handleCompletar(solicitud._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Marcar como completada
                        </Button>
                      </>
                    )}

                    {solicitud.estado === 'completada' && !solicitud.calificacion && (
                      <Button
                        onClick={() => handleCalificar(solicitud._id)}
                        className="bg-[#023859] hover:bg-[#26658C]"
                      >
                        Calificar servicio
                      </Button>
                    )}

                    {solicitud.calificacion && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold">Calificado: {solicitud.calificacion}/5</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}