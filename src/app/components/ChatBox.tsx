import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Send, ArrowLeft } from 'lucide-react';
import { solicitudes } from '../utils/api';
import { toast } from 'sonner';

interface Mensaje {
  remitente: 'cliente' | 'trabajador';
  mensaje: string;
  timestamp: string;
}

interface ChatBoxProps {
  solicitudId: string;
  onBack?: () => void;
  currentUserTipo: 'cliente' | 'trabajador';
}

export default function ChatBox({ solicitudId, onBack, currentUserTipo }: ChatBoxProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMensajes();
    // Polling para actualizar mensajes cada 5 segundos
    const interval = setInterval(loadMensajes, 5000);
    return () => clearInterval(interval);
  }, [solicitudId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const loadMensajes = async () => {
    try {
      const response = await solicitudes.getMensajes(solicitudId);
      if (response.success) {
        setMensajes(response.data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || enviando) return;

    setEnviando(true);
    try {
      const response = await solicitudes.enviarMensaje(solicitudId, nuevoMensaje.trim());
      if (response.success) {
        setMensajes(prev => [...prev, response.data]);
        setNuevoMensaje('');
      }
    } catch (error) {
      toast.error('Error al enviar mensaje');
    } finally {
      setEnviando(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#023859]"></div>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <CardTitle className="text-lg">Chat del servicio</CardTitle>
        </div>
        <div className="text-sm text-gray-500">
          {mensajes.length} mensaje{mensajes.length !== 1 ? 's' : ''}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {mensajes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No hay mensajes aún</p>
                <p className="text-sm">Envía el primer mensaje para comenzar la conversación</p>
              </div>
            ) : (
              mensajes.map((mensaje, index) => (
                <div
                  key={index}
                  className={`flex ${mensaje.remitente === currentUserTipo ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      mensaje.remitente === currentUserTipo
                        ? 'bg-[#023859] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{mensaje.mensaje}</p>
                    <p className={`text-xs mt-1 ${
                      mensaje.remitente === currentUserTipo ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(mensaje.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleEnviarMensaje} className="flex gap-2">
            <Input
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={enviando}
            />
            <Button
              type="submit"
              disabled={!nuevoMensaje.trim() || enviando}
              className="bg-[#023859] hover:bg-[#26658C]"
            >
              {enviando ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}