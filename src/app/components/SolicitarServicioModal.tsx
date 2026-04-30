import { useState } from 'react';
import { X, Calendar, MapPin, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface SolicitarServicioModalProps {
  trabajador: {
    id: string;
    nombre: string;
    servicios: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SolicitarServicioModal({
  trabajador,
  isOpen,
  onClose,
  onSuccess
}: SolicitarServicioModalProps) {
  const [formData, setFormData] = useState({
    servicio: trabajador.servicios[0] || '',
    descripcion: '',
    fecha_preferida: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.servicio || !formData.descripcion) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Debes iniciar sesión para solicitar un servicio');
        return;
      }

      const response = await fetch('http://localhost:5000/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trabajador_id: trabajador.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('¡Solicitud enviada! El trabajador recibirá tu solicitud.');
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Error al enviar solicitud');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#023859' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#26658C' }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              Solicitar Servicio
            </h2>
            <p style={{ color: '#A7EBF2' }}>
              {trabajador.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Servicio */}
          <div>
            <Label className="text-white mb-2 block">
              Tipo de Servicio *
            </Label>
            <select
              value={formData.servicio}
              onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
              className="w-full px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#26658C' }}
              required
            >
              {trabajador.servicios.map((servicio, idx) => (
                <option key={idx} value={servicio}>
                  {servicio}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <Label className="text-white mb-2 block flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Descripción del Trabajo *
            </Label>
            <Textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe detalladamente qué necesitas..."
              className="w-full text-white"
              style={{ backgroundColor: '#26658C', borderColor: '#54ACBF' }}
              rows={4}
              required
            />
            <p className="text-sm mt-1" style={{ color: '#A7EBF2' }}>
              Ejemplo: "Reparación de grifo que gotea en la cocina. El problema es..."
            </p>
          </div>

          {/* Fecha Preferida */}
          <div>
            <Label className="text-white mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha Preferida (Opcional)
            </Label>
            <Input
              type="datetime-local"
              value={formData.fecha_preferida}
              onChange={(e) => setFormData({ ...formData, fecha_preferida: e.target.value })}
              className="w-full text-white"
              style={{ backgroundColor: '#26658C', borderColor: '#54ACBF' }}
            />
          </div>

          {/* Dirección */}
          <div>
            <Label className="text-white mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dirección (Opcional)
            </Label>
            <Input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Ej: Cra 45 #23-10, Barrio Norte"
              className="w-full text-white"
              style={{ backgroundColor: '#26658C', borderColor: '#54ACBF' }}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 font-semibold"
              style={{ backgroundColor: '#54ACBF', color: 'white' }}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white"
            >
              Cancelar
            </Button>
          </div>

          <p className="text-sm text-center" style={{ color: '#A7EBF2' }}>
            El trabajador recibirá tu solicitud y podrá contactarte directamente
          </p>
        </form>
      </div>
    </div>
  );
}
