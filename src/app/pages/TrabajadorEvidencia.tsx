import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Upload, ArrowLeft, X } from 'lucide-react';
import { solicitudes } from '../utils/api';
import { toast } from 'sonner';

interface Solicitud {
  _id: string;
  servicio: string;
  descripcion: string;
  cliente_id: {
    nombre: string;
  };
}

export default function TrabajadorEvidencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

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
      navigate('/trabajador/solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubirEvidencia = async () => {
    if (imagenes.length === 0) {
      toast.error('Por favor selecciona al menos una imagen');
      return;
    }

    setEnviando(true);
    try {
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

      if (imagenesUrls.length > 0) {
        toast.success('Evidencias subidas correctamente');
        navigate('/trabajador/solicitudes');
      } else {
        toast.error('Error al subir evidencias');
      }
    } catch (error) {
      toast.error('Error al enviar evidencias');
    } finally {
      setEnviando(false);
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagenes.length > 10) {
      toast.error('Máximo 10 imágenes');
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
          <Button onClick={() => navigate('/trabajador/solicitudes')} className="mt-4">
            Volver a mis solicitudes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/trabajador/solicitudes')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis solicitudes
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#023859]">Subir Evidencia</CardTitle>
              <p className="text-gray-600">Sube fotos del trabajo realizado</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información del servicio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#023859] mb-2">{solicitud.servicio}</h3>
                <p className="text-gray-600 mb-2">{solicitud.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Cliente: {solicitud.cliente_id.nombre}
                </p>
              </div>

              {/* Descripción opcional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe el trabajo realizado..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos del trabajo realizado *
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
                      {imagenes.length}/10 fotos
                    </span>
                  </div>

                  {imagenes.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {imagenes.map((imagen, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(imagen)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
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
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => navigate('/trabajador/solicitudes')}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubirEvidencia}
                  disabled={imagenes.length === 0 || enviando}
                  className="flex-1 bg-[#023859] hover:bg-[#26658C]"
                >
                  {enviando ? 'Subiendo...' : 'Subir evidencias'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}