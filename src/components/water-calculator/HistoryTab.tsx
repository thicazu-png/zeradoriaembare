import { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calculateHistoricalAverage, formatNumber, type HistoricalEntry } from "@/lib/waterTariff";

interface HistoryTabProps {
  entries: HistoricalEntry[];
  onChange: (entries: HistoricalEntry[]) => void;
}

const HistoryTab = ({ entries, onChange }: HistoryTabProps) => {
  const [newEntry, setNewEntry] = useState({
    monthYear: "",
    consumption: "",
    cycleDays: "",
  });

  const averages = calculateHistoricalAverage(entries, true);

  const handleAddEntry = () => {
    if (!newEntry.monthYear || !newEntry.consumption || !newEntry.cycleDays) return;

    const entry: HistoricalEntry = {
      id: crypto.randomUUID(),
      monthYear: newEntry.monthYear,
      consumption: parseFloat(newEntry.consumption),
      cycleDays: parseInt(newEntry.cycleDays),
    };

    onChange([...entries, entry]);
    setNewEntry({ monthYear: "", consumption: "", cycleDays: "" });
  };

  const handleRemoveEntry = (id: string) => {
    onChange(entries.filter((e) => e.id !== id));
  };

  const januaryEntries = entries.filter((e) => e.monthYear.startsWith("01/"));

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-2">Base Histórica de Referência</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione os dados dos últimos 24 meses. Janeiro é excluído automaticamente do cálculo.
        </p>

        <div className="grid gap-3 sm:grid-cols-4 mb-4">
          <div className="space-y-1">
            <Label htmlFor="monthYear" className="text-xs">Mês/Ano</Label>
            <Input
              id="monthYear"
              value={newEntry.monthYear}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (value.length > 6) value = value.slice(0, 6);
                if (value.length >= 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }
                setNewEntry({ ...newEntry, monthYear: value });
              }}
              placeholder="MM/AAAA"
              maxLength={7}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="consumption" className="text-xs">Consumo (m³)</Label>
            <Input
              id="consumption"
              type="number"
              min="0"
              value={newEntry.consumption}
              onChange={(e) => setNewEntry({ ...newEntry, consumption: e.target.value })}
              placeholder="Ex: 15"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cycleDays" className="text-xs">Dias do Ciclo</Label>
            <Input
              id="cycleDays"
              type="number"
              min="1"
              value={newEntry.cycleDays}
              onChange={(e) => setNewEntry({ ...newEntry, cycleDays: e.target.value })}
              placeholder="Ex: 30"
              className="h-9"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddEntry} size="sm" className="w-full h-9">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês/Ano</TableHead>
                  <TableHead className="text-right">Consumo (m³)</TableHead>
                  <TableHead className="text-right">Dias</TableHead>
                  <TableHead className="text-right">Consumo Diário</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const isJanuary = entry.monthYear.startsWith("01/");
                  const dailyConsumption = entry.cycleDays > 0 ? entry.consumption / entry.cycleDays : 0;
                  
                  return (
                    <TableRow key={entry.id} className={isJanuary ? "opacity-50" : ""}>
                      <TableCell>
                        {entry.monthYear}
                        {isJanuary && <span className="text-xs text-muted-foreground ml-1">(excluído)</span>}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(entry.consumption, 1)}</TableCell>
                      <TableCell className="text-right">{entry.cycleDays}</TableCell>
                      <TableCell className="text-right">{formatNumber(dailyConsumption, 3)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum dado histórico adicionado.</p>
            <p className="text-sm">Adicione os dados para calcular a média.</p>
          </div>
        )}
      </div>

      {januaryEntries.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {januaryEntries.length} registro(s) de janeiro foram excluídos do cálculo da média.
          </AlertDescription>
        </Alert>
      )}

      {averages.validEntries > 0 && (
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-3">📊 Médias Calculadas</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{formatNumber(averages.monthlyAverage, 1)}</p>
              <p className="text-xs text-muted-foreground">Média Mensal (m³)</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{formatNumber(averages.dailyAverage, 3)}</p>
              <p className="text-xs text-muted-foreground">Média Diária (m³)</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{averages.validEntries}</p>
              <p className="text-xs text-muted-foreground">Meses Analisados</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
