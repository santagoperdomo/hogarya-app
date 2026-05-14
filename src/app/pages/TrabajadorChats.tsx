import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, MessageCircle, User, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import { auth, solicitudes } from '../utils/api';
import { toast } from 'sonner';

export default function TrabajadorChats() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [solicitudesList, setSolicitudesList] = useState<any[]>([]);

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
    loadSolicitudes();
  }, [navigate]);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await solicitudes.getTrabajador();
      if (response?.success) {
        setSolicitudesList(response.data || []);
      } else {
        throw new Error('No se pudieron cargar los chats');
      }
    } catch (error: any) {
      console.error('Error cargando chats:', error);
      toast.error(error.message || 'Error al cargar chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (solicitudId: string) => {
    navigate(`/trabajador/solicitudes/${solicitudId}/chat`);
  };

  const chatRequests = solicitudesList.filter(
    (solicitud) =>
      solicitud.estado === 'aceptada' ||
      (solicitud.mensajes_chat && solicitud.mensajes_chat.length > 0),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <Header user={user} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-sm font-semibold text-[#54ACBF] flex items-center gap-2">
              <Bell className="w-5 h-5" /> Chats
            </p>
            <h1 className="text-3xl font-bold text-[#011C40]">Conversa con tus clientes</h1>
            <p className="text-sm text-gray-600 mt-2">
              Revisa tus conversaciones y continua el seguimiento de solicitudes.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/trabajador/solicitudes')}
            className="border-[#54ACBF] text-[#023859]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a solicitudes
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#54ACBF' }} />
              <p className="text-[#023859]">Cargando chats...</p>
            </div>
          </div>
        ) : chatRequests.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <p className="text-xl font-semibold text-[#011C40]">No tienes chats activos</p>
            <p className="text-gray-600 mt-2">Acepta una solicitud o revisa tus solicitudes pendientes para iniciar un chat con el cliente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatRequests.map((solicitud) => (
              <div key={solicitud.id || solicitud._id} className="rounded-3xl bg-white shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <h2 className="text-xl font-semibold text-[#011C40]">{solicitud.servicio}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-3 py-1 text-sm font-semibold"
                      style={{
                        backgroundColor: solicitud.estado === 'aceptada' ? '#E8FDF5' : '#F3F4F6',
                        color: solicitud.estado === 'aceptada' ? '#047857' : '#6B7280'
                      }}
                    >
                      {solicitud.estado === 'aceptada' ? 'Aceptada' : 'Chat disponible'}
                    </span>
                    <span className="rounded-full px-3 py-1 text-sm font-semibold bg-[#EEF2FF] text-[#4338CA]">
                      {solicitud.mensajes_chat?.length || 0} mensajes
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    <p className="font-semibold text-[#023859]">Cliente</p>
                    <p className="flex items-center gap-2"><User className="w-4 h-4" /> {solicitud.cliente_id?.nombre || solicitud.cliente_nombre || 'Cliente'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-[#023859]">Contacto</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {solicitud.cliente_id?.telefono || 'No disponible'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-[#023859]">Dirección</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {solicitud.direccion || 'No especificada'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-[#023859]">Fecha:</span> {solicitud.fecha_preferida ? new Date(solicitud.fecha_preferida).toLocaleDateString() : 'Sin fecha'}
                  </div>
                  <Button
                    onClick={() => handleChat(solicitud.id || solicitud._id)}
                    className="bg-[#54ACBF] text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Ir al chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
