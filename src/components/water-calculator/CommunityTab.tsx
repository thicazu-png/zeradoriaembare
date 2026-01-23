import { useState } from "react";
import { Users, Plus, Trash2, TrendingUp, Building2 } from "lucide-react";
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
import { formatCurrency, formatNumber } from "@/lib/waterTariff";

interface CommunityEntry {
  id: string;
  name: string;
  chargedValue: number;
  technicalValue: number;
  consumption: number;
}

const CommunityTab = () => {
  const [entries, setEntries] = useState<CommunityEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    name: "",
    chargedValue: "",
    technicalValue: "",
    consumption: "",
  });

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.chargedValue || !newEntry.technicalValue || !newEntry.consumption) return;

    const entry: CommunityEntry = {
      id: crypto.randomUUID(),
      name: newEntry.name,
      chargedValue: parseFloat(newEntry.chargedValue),
      technicalValue: parseFloat(newEntry.technicalValue),
      consumption: parseFloat(newEntry.consumption),
    };

    setEntries([...entries, entry]);
    setNewEntry({ name: "", chargedValue: "", technicalValue: "", consumption: "" });
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Community statistics
  const stats = entries.length > 0 ? {
    totalResidences: entries.length,
    avgConsumption: entries.reduce((sum, e) => sum + e.consumption, 0) / entries.length,
    avgChargedValue: entries.reduce((sum, e) => sum + e.chargedValue, 0) / entries.length,
    avgTechnicalValue: entries.reduce((sum, e) => sum + e.technicalValue, 0) / entries.length,
    totalDifference: entries.reduce((sum, e) => sum + (e.chargedValue - e.technicalValue), 0),
    avgDifference: entries.reduce((sum, e) => sum + (e.chargedValue - e.technicalValue), 0) / entries.length,
    avgDistortion: entries.reduce((sum, e) => {
      return sum + ((e.chargedValue - e.technicalValue) / e.technicalValue * 100);
    }, 0) / entries.length,
  } : null;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Análise Coletiva do Bairro</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione os dados das residências do bairro para gerar estatísticas coletivas.
        </p>

        <div className="grid gap-3 sm:grid-cols-5 mb-4">
          <div className="space-y-1">
            <Label htmlFor="entryName" className="text-xs">Nome/Endereço</Label>
            <Input
              id="entryName"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              placeholder="Identificação"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="entryConsumption" className="text-xs">Consumo (m³)</Label>
            <Input
              id="entryConsumption"
              type="number"
              min="0"
              value={newEntry.consumption}
              onChange={(e) => setNewEntry({ ...newEntry, consumption: e.target.value })}
              placeholder="Ex: 20"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="entryCharged" className="text-xs">Valor Cobrado (R$)</Label>
            <Input
              id="entryCharged"
              type="number"
              step="0.01"
              min="0"
              value={newEntry.chargedValue}
              onChange={(e) => setNewEntry({ ...newEntry, chargedValue: e.target.value })}
              placeholder="Ex: 150"
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="entryTechnical" className="text-xs">Valor Técnico (R$)</Label>
            <Input
              id="entryTechnical"
              type="number"
              step="0.01"
              min="0"
              value={newEntry.technicalValue}
              onChange={(e) => setNewEntry({ ...newEntry, technicalValue: e.target.value })}
              placeholder="Ex: 120"
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
                  <TableHead>Identificação</TableHead>
                  <TableHead className="text-right">Consumo (m³)</TableHead>
                  <TableHead className="text-right">Cobrado</TableHead>
                  <TableHead className="text-right">Técnico</TableHead>
                  <TableHead className="text-right">Diferença</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const diff = entry.chargedValue - entry.technicalValue;
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell className="text-right">{formatNumber(entry.consumption, 1)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.chargedValue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.technicalValue)}</TableCell>
                      <TableCell className={`text-right font-medium ${diff > 0 ? "text-destructive" : "text-green-600"}`}>
                        {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                      </TableCell>
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
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma residência adicionada.</p>
            <p className="text-sm">Adicione dados para gerar estatísticas do bairro.</p>
          </div>
        )}
      </div>

      {stats && (
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Estatísticas do Bairro</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalResidences}</p>
              <p className="text-xs text-muted-foreground">Total de Residências</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{formatNumber(stats.avgConsumption, 1)} m³</p>
              <p className="text-xs text-muted-foreground">Consumo Médio</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.avgChargedValue)}</p>
              <p className="text-xs text-muted-foreground">Valor Médio Cobrado</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.avgTechnicalValue)}</p>
              <p className="text-xs text-muted-foreground">Valor Técnico Médio</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mt-4">
            <div className={`rounded-lg p-3 text-center ${stats.totalDifference > 0 ? "bg-destructive/10 border border-destructive/20" : "bg-green-500/10 border border-green-500/20"}`}>
              <p className={`text-2xl font-bold ${stats.totalDifference > 0 ? "text-destructive" : "text-green-600"}`}>
                {stats.totalDifference > 0 ? "+" : ""}{formatCurrency(stats.totalDifference)}
              </p>
              <p className="text-xs text-muted-foreground">Impacto Financeiro Total</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${stats.avgDifference > 0 ? "bg-destructive/10 border border-destructive/20" : "bg-green-500/10 border border-green-500/20"}`}>
              <p className={`text-2xl font-bold ${stats.avgDifference > 0 ? "text-destructive" : "text-green-600"}`}>
                {stats.avgDifference > 0 ? "+" : ""}{formatCurrency(stats.avgDifference)}
              </p>
              <p className="text-xs text-muted-foreground">Impacto Médio por Residência</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${stats.avgDistortion > 0 ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/50"}`}>
              <p className={`text-2xl font-bold ${stats.avgDistortion > 0 ? "text-amber-600" : "text-foreground"}`}>
                {stats.avgDistortion > 0 ? "+" : ""}{formatNumber(stats.avgDistortion, 1)}%
              </p>
              <p className="text-xs text-muted-foreground">Distorção Tarifária Média</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityTab;
