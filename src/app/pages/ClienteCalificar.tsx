import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Star, ArrowLeft, Upload } from 'lucide-react';
import { solicitudes, auth } from '../utils/api';
import { toast } from 'sonner';

interface Solicitud {
  _id: string;
  servicio: string;
  descripcion: string;
  trabajador_id: {
    nombre: string;
    especialidad: string;
  };
}

export default function ClienteCalificar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    if (id) {
      loadSolicitud();
    }
  }, [id, navigate]);

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

  const handleCalificar = async () => {
    if (calificacion === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setEnviando(true);
    try {
      // Subir imágenes si las hay
      let imagenesUrls: string[] = [];
      for (const imagen of imagenes) {
        try {
          const response = await solicitudes.subirEvidencia(id!, imagen);
          if (response.success) {
            imagenesUrls.push(response.data);
          }
        } catch (error) {
          console.error('Error al subir imagen:', error);
        }
      }

      const response = await solicitudes.calificar(id!, calificacion, comentario, imagenesUrls);
      if (response.success) {
        toast.success('¡Gracias por tu calificación!');
        navigate('/cliente/solicitudes');
      }
    } catch (error) {
      toast.error('Error al enviar calificación');
    } finally {
      setEnviando(false);
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagenes.length > 5) {
      toast.error('Máximo 5 imágenes');
      return;
    }
    setImagenes(prev => [...prev, ...files]);
  };

  const removeImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023859] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/cliente/solicitudes')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis solicitudes
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#023859]">Calificar Servicio</CardTitle>
              <p className="text-gray-600">Tu opinión nos ayuda a mejorar</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información del servicio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#023859] mb-2">{solicitud.servicio}</h3>
                <p className="text-gray-600 mb-2">{solicitud.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Trabajador: {solicitud.trabajador_id.nombre} - {solicitud.trabajador_id.especialidad}
                </p>
              </div>

              {/* Calificación con estrellas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Calificación *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCalificacion(star)}
                      onMouseEnter={() => setHoverCalificacion(star)}
                      onMouseLeave={() => setHoverCalificacion(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverCalificacion || calificacion)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {calificacion > 0 && `${calificacion} estrella${calificacion !== 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (opcional)
                </label>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos tu experiencia con el servicio..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos del trabajo (opcional)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagenChange}
                      className="hidden"
                      id="imagenes"
                    />
                    <label
                      htmlFor="imagenes"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      Agregar fotos
                    </label>
                    <span className="text-sm text-gray-500">
                      {imagenes.length}/5 fotos
                    </span>
                  </div>

                  {imagenes.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {imagenes.map((imagen, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(imagen)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImagen(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => navigate('/cliente/solicitudes')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCalificar}
                  disabled={calificacion === 0 || enviando}
                  className="flex-1 bg-[#023859] hover:bg-[#26658C]"
                >
                  {enviando ? 'Enviando...' : 'Enviar calificación'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}