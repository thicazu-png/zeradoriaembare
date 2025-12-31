import { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LocationPickerProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "0.75rem",
};

// Default center: Jardim Embaré area (Santos/SP region)
const defaultCenter = {
  lat: -23.9618,
  lng: -46.3322,
};

const libraries: ("places")[] = ["places"];

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLocating, setIsLocating] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch API key from edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-maps-key');
        if (error) throw error;
        setApiKey(data.apiKey);
      } catch (err) {
        console.error('Error fetching Google Maps API key:', err);
      } finally {
        setIsLoadingKey(false);
      }
    };
    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "placeholder",
    libraries,
    id: "google-maps-script",
  });

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !apiKey) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "br" },
      fields: ["formatted_address", "geometry"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";
        
        setMarker({ lat, lng });
        setMapCenter({ lat, lng });
        onChange(address, lat, lng);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, apiKey, onChange]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            onChange(results[0].formatted_address, lat, lng);
          } else {
            onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
          }
        });
      }
    },
    [onChange]
  );

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo navegador");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarker({ lat, lng });
        setMapCenter({ lat, lng });

        // Reverse geocode
        if (isLoaded) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              onChange(results[0].formatted_address, lat, lng);
            } else {
              onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
            }
            setIsLocating(false);
          });
        } else {
          onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Não foi possível obter sua localização");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (isLoadingKey || !apiKey) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Carregando mapa..."
            disabled
            className="h-12 pl-10 rounded-xl"
          />
        </div>
        <div className="h-[200px] rounded-xl bg-muted flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (loadError || !apiKey) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rua, número, referência..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 pl-10 rounded-xl"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Mapa indisponível. Digite o endereço manualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            placeholder="Pesquisar endereço..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 pl-10 rounded-xl"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="h-12 w-12 rounded-xl flex-shrink-0"
          title="Usar minha localização"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isLoaded && (
        <div className="relative overflow-hidden rounded-xl border border-border shadow-sm">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
          <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-muted-foreground">
            Toque no mapa para marcar
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
