import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Button } from "@/components/ui/button";
import { MessageCircle, Store } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Business {
  categoria: string | null | undefined;
  nome: string | null | undefined;
  endereco: string | null | undefined;
  contatos: string | number | null | undefined;
  logo: string | null | undefined;
  lat?: number | null;
  lng?: number | null;
}

interface BusinessMapProps {
  businesses: Business[];
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const extractContactNumber = (contatos: string | number | null | undefined): { number: string; hasWhatsApp: boolean } | null => {
  const phoneStr = contatos ? String(contatos) : '';
  const numbers = phoneStr.replace(/\D/g, "");
  
  if (numbers.length > 0) {
    if (numbers.length >= 10) {
      const formattedNumber = numbers.startsWith("55") ? numbers : `55${numbers}`;
      return { number: formattedNumber, hasWhatsApp: true };
    }
    return { number: numbers, hasWhatsApp: false };
  }
  return null;
};

const BusinessMap = ({ businesses }: BusinessMapProps) => {
  // Centro aproximado do Jardim Embaré, São Carlos
  const centerPosition: [number, number] = [-21.987, -47.887];
  
  // Filtra apenas comércios com coordenadas válidas
  const businessesWithCoords = businesses.filter(
    (b) => b.lat && b.lng && !isNaN(Number(b.lat)) && !isNaN(Number(b.lng))
  );

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={centerPosition}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {businessesWithCoords.map((business, index) => {
          const contactInfo = extractContactNumber(business.contatos);
          const nomeStr = String(business.nome || 'Sem nome');
          const enderecoStr = business.endereco ? String(business.endereco) : null;
          
          return (
            <Marker
              key={index}
              position={[Number(business.lat), Number(business.lng)]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4 text-primary" />
                    <strong className="text-foreground">{nomeStr}</strong>
                  </div>
                  
                  {enderecoStr && (
                    <p className="text-xs text-muted-foreground mb-2">{enderecoStr}</p>
                  )}
                  
                  {contactInfo && (
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                      onClick={() => {
                        if (contactInfo.hasWhatsApp) {
                          window.open(`https://wa.me/${contactInfo.number}`, "_blank");
                        } else {
                          window.open(`tel:${contactInfo.number}`, "_self");
                        }
                      }}
                    >
                      <MessageCircle className="h-3 w-3" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {businessesWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center text-muted-foreground p-4">
            <Store className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum comércio com localização cadastrada ainda.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessMap;
