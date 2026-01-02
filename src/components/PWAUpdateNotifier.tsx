import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

const PWAUpdateNotifier = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('SW registrado:', swUrl);
      // Check for updates every 30 seconds
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 30 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('Erro ao registrar SW:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
      // Auto-update after 2 seconds
      const timer = setTimeout(() => {
        updateServiceWorker(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [needRefresh, updateServiceWorker]);

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <div className="flex-1">
          <p className="font-medium text-sm">Nova versão disponível!</p>
          <p className="text-xs opacity-90">Atualizando automaticamente...</p>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotifier;
