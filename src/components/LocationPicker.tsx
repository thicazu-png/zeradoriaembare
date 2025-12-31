import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationPickerProps {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
}

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Rua, número, bairro..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-10 rounded-xl"
      />
    </div>
  );
};

export default LocationPicker;
