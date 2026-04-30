import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, CheckCircle, Clock, XCircle, MapPin, Phone, User, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import { auth, solicitudes } from '../utils/api';
import { toast } from 'sonner';

export default function TrabajadorSolicitudes() {
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
        setSolicitudesList(response.solicitudes || []);
      } else {
        throw new Error('No se pudieron cargar las solicitudes');
      }
    } catch (error: any) {
      console.error('Error cargando solicitudes:', error);
      toast.error(error.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitudAction = async (id: string, estado: 'aceptada' | 'rechazada') => {
    try {
      setLoading(true);
      const response = await solicitudes.update(id, { estado });
      if (response?.success) {
        toast.success(
          estado === 'aceptada'
            ? 'Solicitud aceptada'
            : 'Solicitud rechazada',
        );
        loadSolicitudes();
      } else {
        throw new Error('No se pudo actualizar la solicitud');
      }
    } catch (error: any) {
      console.error('Error actualizando solicitud:', error);
      toast.error(error.message || 'Error al actualizar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <Header user={user} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-[#54ACBF] flex items-center gap-2">
              <Bell className="w-5 h-5" /> Mis solicitudes
            </p>
            <h1 className="text-3xl font-bold text-[#011C40]">Solicitudes de servicio</h1>
            <p className="text-sm text-gray-600 mt-2">
              Aquí puedes aceptar o rechazar las solicitudes que te envían los clientes.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/trabajador/dashboard')}
            className="border-[#54ACBF] text-[#023859]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al panel
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#54ACBF' }} />
              <p className="text-[#023859]">Cargando solicitudes...</p>
            </div>
          </div>
        ) : solicitudesList.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <p className="text-xl font-semibold text-[#011C40]">No tienes solicitudes pendientes</p>
            <p className="text-gray-600 mt-2">Cuando un cliente solicite tu servicio, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudesList.map((solicitud) => (
              <div key={solicitud.id || solicitud._id} className="rounded-3xl bg-white shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Servicio solicitado</p>
                    <h2 className="text-xl font-semibold text-[#011C40]">{solicitud.servicio}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-3 py-1 text-sm font-semibold"
                      style={{
                        backgroundColor: solicitud.estado === 'pendiente' ? '#FFF4E5' : solicitud.estado === 'aceptada' ? '#E8FDF5' : '#FEE2E2',
                        color: solicitud.estado === 'pendiente' ? '#B45309' : solicitud.estado === 'aceptada' ? '#047857' : '#B91C1C'
                      }}
                    >
                      {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
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

                <p className="text-gray-700 mb-4">{solicitud.descripcion}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-[#023859]">Fecha:</span> {solicitud.fecha_preferida ? new Date(solicitud.fecha_preferida).toLocaleDateString() : 'Sin fecha'}
                  </div>
                  {solicitud.estado === 'pendiente' ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleSolicitudAction(solicitud.id || solicitud._id, 'aceptada')}
                        className="bg-[#54ACBF] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Aceptar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSolicitudAction(solicitud.id || solicitud._id, 'rechazada')}
                        className="border-[#F87171] text-[#B91C1C]"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Rechazar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {solicitud.estado === 'aceptada' ? 'Ya aceptaste esta solicitud' : solicitud.estado === 'rechazada' ? 'Solicitud rechazada' : 'Solicitud cerrada'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
