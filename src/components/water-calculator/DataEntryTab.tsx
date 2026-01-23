import { CalendarIcon, AlertCircle } from "lucide-react";
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
  const isFieldEmpty = (value: string | number | Date | null) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (typeof value === "number") return value === 0;
    return false;
  };

  const showRequiredError = (fieldValue: string | number | Date | null) => {
    return isFieldEmpty(fieldValue);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Todos os campos são obrigatórios para realizar a análise e salvar o relatório.
        </p>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Dados da Residência</h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="flex items-center gap-1">
              Nome do Usuário <span className="text-destructive">*</span>
            </Label>
            <Input
              id="userName"
              value={data.userName}
              onChange={(e) => onChange({ userName: e.target.value })}
              placeholder="Nome completo"
              className={cn(showRequiredError(data.userName) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.userName) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cdcDv" className="flex items-center gap-1">
              Código de Cadastro (CDC-DV) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cdcDv"
              value={data.cdcDv}
              onChange={(e) => onChange({ cdcDv: e.target.value })}
              placeholder="Ex: 123456-7"
              className={cn(showRequiredError(data.cdcDv) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.cdcDv) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Datas de Leitura</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Data da Leitura Anterior <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.previousReadingDate && "text-muted-foreground",
                    showRequiredError(data.previousReadingDate) && "border-destructive/50"
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
            {showRequiredError(data.previousReadingDate) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Data da Leitura Atual <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.currentReadingDate && "text-muted-foreground",
                    showRequiredError(data.currentReadingDate) && "border-destructive/50"
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
            {showRequiredError(data.currentReadingDate) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Leituras do Hidrômetro</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="previousReading" className="flex items-center gap-1">
              Leitura Anterior (m³) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="previousReading"
              type="number"
              min="0"
              value={data.previousReading || ""}
              onChange={(e) => onChange({ previousReading: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 1234"
              className={cn(showRequiredError(data.previousReading) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.previousReading) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentReading" className="flex items-center gap-1">
              Leitura Atual (m³) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="currentReading"
              type="number"
              min="0"
              value={data.currentReading || ""}
              onChange={(e) => onChange({ currentReading: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 1254"
              className={cn(showRequiredError(data.currentReading) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.currentReading) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Valores da Conta</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="chargedValue" className="flex items-center gap-1">
              Valor Cobrado (R$) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chargedValue"
              type="number"
              step="0.01"
              min="0"
              value={data.chargedValue || ""}
              onChange={(e) => onChange({ chargedValue: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 150,00"
              className={cn(showRequiredError(data.chargedValue) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.chargedValue) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixedFee" className="flex items-center gap-1">
              Taxa Fixa de Resíduos Sólidos (R$) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fixedFee"
              type="number"
              step="0.01"
              min="0"
              value={data.fixedFee || ""}
              onChange={(e) => onChange({ fixedFee: parseFloat(e.target.value) || 0 })}
              placeholder="Ex: 25,00"
              className={cn(showRequiredError(data.fixedFee) && "border-destructive/50")}
              required
            />
            {showRequiredError(data.fixedFee) && (
              <p className="text-xs text-destructive">Campo obrigatório</p>
            )}
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
