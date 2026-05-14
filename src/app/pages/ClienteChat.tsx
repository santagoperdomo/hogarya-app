import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { solicitudes } from '../utils/api';
import { auth } from '../utils/api';
import { toast } from 'sonner';

interface Solicitud {
  _id: string;
  servicio: string;
  descripcion: string;
  estado: string;
  trabajador_id: {
    nombre: string;
    especialidad: string;
    calificacion: number;
  };
  precio_acordado?: number;
  calificacion?: number;
}

export default function ClienteChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSolicitud();
    }
  }, [id]);

  const loadSolicitud = async () => {
    try {
      const response = await solicitudes.getById(id!);
      if (response.success) {
        setSolicitud(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar solicitud');
      navigate('/cliente/solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletar = async () => {
    if (!id) return;
    try {
      const response = await solicitudes.completar(id);
      if (response.success) {
        toast.success('Solicitud marcada como completada');
        setSolicitud(prev => prev ? { ...prev, estado: 'completada' } : null);
      }
    } catch (error) {
      toast.error('Error al completar solicitud');
    }
  };

  const handleCalificar = () => {
    navigate(`/cliente/solicitudes/${id}/calificar`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023859] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Solicitud no encontrada</p>
          <Button onClick={() => navigate('/cliente/solicitudes')} className="mt-4">
            Volver a mis solicitudes
          </Button>
        </div>
      </div>
    );
  }

  const currentUser = auth.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/cliente/solicitudes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis solicitudes
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-[#023859]">{solicitud.servicio}</CardTitle>
                  <p className="text-gray-600 mt-1">{solicitud.descripcion}</p>
                </div>
                <Badge className={`${
                  solicitud.estado === 'aceptada' ? 'bg-green-500' :
                  solicitud.estado === 'completada' ? 'bg-blue-500' : 'bg-yellow-500'
                } text-white`}>
                  {solicitud.estado === 'aceptada' ? 'Aceptada' :
                   solicitud.estado === 'completada' ? 'Completada' : 'Pendiente'}
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
                {solicitud.precio_acordado && (
                  <div>
                    <h4 className="font-semibold text-[#023859] mb-2">Precio acordado</h4>
                    <p className="text-gray-700 text-lg font-semibold">${solicitud.precio_acordado}</p>
                  </div>
                )}
              </div>

              {solicitud.estado === 'aceptada' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCompletar}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como completada
                  </Button>
                </div>
              )}

              {solicitud.estado === 'completada' && !solicitud.calificacion && (
                <Button
                  onClick={handleCalificar}
                  className="bg-[#023859] hover:bg-[#26658C]"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Calificar servicio
                </Button>
              )}

              {solicitud.calificacion && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">Calificado: {solicitud.calificacion}/5 estrellas</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <ChatBox
            solicitudId={id!}
            currentUserTipo="cliente"
          />
        </div>
      </div>
    </div>
  );
}