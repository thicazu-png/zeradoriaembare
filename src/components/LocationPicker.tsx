import { useState } from "react";
import { MapPin, Crosshair, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  required?: boolean;
  placeholder?: string;
}

const LocationPicker = ({ value, onChange, required, placeholder = "Rua, número, bairro..." }: LocationPickerProps) => {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS não suportado",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange("📍 Localização via GPS detectada", latitude, longitude);
        toast({
          title: "Localização obtida!",
          description: `Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let message = "Não foi possível obter sua localização.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Permissão de localização negada. Habilite nas configurações do navegador.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Localização indisponível no momento.";
        } else if (error.code === error.TIMEOUT) {
          message = "Tempo esgotado ao buscar localização.";
        }
        toast({
          title: "Erro de localização",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 pl-10 pr-4 rounded-xl"
          required={required}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={handleGetLocation}
        disabled={isLocating}
      >
        {isLocating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Obtendo localização...
          </>
        ) : (
          <>
            <Crosshair className="h-4 w-4" />
            📍 Usar minha localização atual
          </>
        )}
      </Button>
    </div>
  );
};

export default LocationPicker;
