import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ResidenceData } from "@/lib/waterTariff";

interface DataEntryTabProps {
  data: ResidenceData;
  onChange: (data: Partial<ResidenceData>) => void;
}

const DataEntryTab = ({ data, onChange }: DataEntryTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Dados da Residência</h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nome do Usuário</Label>
            <Input
              id="userName"
              value={data.userName}
              onChange={(e) => onChange({ userName: e.target.value })}
              placeholder="Nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cdcDv">Código de Cadastro (CDC-DV)</Label>
            <Input
              id="cdcDv"
              value={data.cdcDv}
              onChange={(e) => onChange({ cdcDv: e.target.value })}
              placeholder="Ex: 123456-7"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Datas de Leitura</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Data da Leitura Anterior</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.previousReadingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.previousReadingDate ? (
                    format(data.previousReadingDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.previousReadingDate || undefined}
                  onSelect={(date) => onChange({ previousReadingDate: date || null })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data da Leitura Atual</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.currentReadingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.currentReadingDate ? (
                    format(data.currentReadingDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.currentReadingDate || undefined}
                  onSelect={(date) => onChange({ currentReadingDate: date || null })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Leituras do Hidrômetro</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="previousReading">Leitura Anterior (m³)</Label>
            <Input
              id="previousReading"
              type="number"
              min="0"
              value={data.previousReading || ""}
              onChange={(e) => onChange({ previousReading: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentReading">Leitura Atual (m³)</Label>
            <Input
              id="currentReading"
              type="number"
              min="0"
              value={data.currentReading || ""}
              onChange={(e) => onChange({ currentReading: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 1254"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Valores da Conta</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="chargedValue">Valor Cobrado (R$)</Label>
            <Input
              id="chargedValue"
              type="number"
              step="0.01"
              min="0"
              value={data.chargedValue || ""}
              onChange={(e) => onChange({ chargedValue: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 150,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixedFee">Taxa Fixa de Resíduos Sólidos (R$)</Label>
            <Input
              id="fixedFee"
              type="number"
              step="0.01"
              min="0"
              value={data.fixedFee || ""}
              onChange={(e) => onChange({ fixedFee: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 25,00"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <Label htmlFor="includeSewer" className="font-medium">Incluir Esgoto</Label>
            <p className="text-xs text-muted-foreground">100% do valor da água</p>
          </div>
          <Switch
            id="includeSewer"
            checked={data.includeSewer}
            onCheckedChange={(checked) => onChange({ includeSewer: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default DataEntryTab;
