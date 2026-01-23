import { useState } from "react";
import { Search, FileSearch, Calendar, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, formatNumber } from "@/lib/waterTariff";

interface AnalysisResult {
  id: string;
  created_at: string;
  user_name: string;
  cdc_dv: string;
  previous_reading_date: string;
  current_reading_date: string;
  previous_reading: number;
  current_reading: number;
  charged_value: number;
  cycle_days: number;
  consumption: number;
  normalized_consumption: number;
  water_value: number;
  sewer_value: number;
  total_technical_value: number;
  difference_absolute: number;
  difference_percent: number;
  historical_average: number | null;
  volume_anomaly: number | null;
  diagnosis_items: string[];
}

const SearchAnalysisModal = () => {
  const [open, setOpen] = useState(false);
  const [searchCdc, setSearchCdc] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchCdc.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from("water_analyses")
        .select("*")
        .eq("cdc_dv", searchCdc.trim())
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setResults((data as AnalysisResult[]) || []);
      setSelectedAnalysis(null);
    } catch (error) {
      console.error("Error searching analyses:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSearch className="h-4 w-4" />
          Consultar Relatórios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultar Relatórios Salvos</DialogTitle>
          <DialogDescription>
            Digite o número CDC para buscar relatórios anteriores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o CDC (ex: 12345678-9)"
              value={searchCdc}
              onChange={(e) => setSearchCdc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchCdc.trim()}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {hasSearched && results.length === 0 && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              <FileSearch className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum relatório encontrado para este CDC.</p>
            </div>
          )}

          {results.length > 0 && !selectedAnalysis && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {results.length} relatório(s) encontrado(s):
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Consumo Norm.</TableHead>
                    <TableHead className="text-right">Diferença</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell>{formatDate(analysis.created_at)}</TableCell>
                      <TableCell>
                        {formatDate(analysis.previous_reading_date)} - {formatDate(analysis.current_reading_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(analysis.normalized_consumption, 1)} m³
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={analysis.difference_absolute > 0 ? "text-destructive" : analysis.difference_absolute < 0 ? "text-green-600" : ""}>
                          {analysis.difference_absolute > 0 ? "+" : ""}
                          {formatCurrency(analysis.difference_absolute)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedAnalysis && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAnalysis(null)}
              >
                ← Voltar para lista
              </Button>

              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dados da Análise
                </h4>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><strong>Nome:</strong> {selectedAnalysis.user_name}</p>
                  <p><strong>CDC:</strong> {selectedAnalysis.cdc_dv}</p>
                  <p><strong>Data da análise:</strong> {formatDate(selectedAnalysis.created_at)}</p>
                  <p><strong>Período:</strong> {formatDate(selectedAnalysis.previous_reading_date)} - {formatDate(selectedAnalysis.current_reading_date)}</p>
                  <p><strong>Dias do ciclo:</strong> {selectedAnalysis.cycle_days}</p>
                  <p><strong>Consumo real:</strong> {formatNumber(selectedAnalysis.consumption, 1)} m³</p>
                  <p><strong>Consumo normalizado:</strong> {formatNumber(selectedAnalysis.normalized_consumption, 1)} m³</p>
                  {selectedAnalysis.historical_average && (
                    <p><strong>Média histórica:</strong> {formatNumber(selectedAnalysis.historical_average, 1)} m³</p>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-semibold mb-3">💰 Comparativo de Valores</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Valor Cobrado</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedAnalysis.charged_value)}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground">Valor Técnico Justo</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(selectedAnalysis.total_technical_value)}</p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${selectedAnalysis.difference_absolute > 0 ? "bg-destructive/10 border border-destructive/20" : selectedAnalysis.difference_absolute < 0 ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50"}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {selectedAnalysis.difference_absolute > 0 ? (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      ) : selectedAnalysis.difference_absolute < 0 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                      <p className="text-sm text-muted-foreground">Diferença</p>
                    </div>
                    <p className={`text-xl font-bold ${selectedAnalysis.difference_absolute > 0 ? "text-destructive" : selectedAnalysis.difference_absolute < 0 ? "text-green-600" : ""}`}>
                      {selectedAnalysis.difference_absolute > 0 ? "+" : ""}{formatCurrency(selectedAnalysis.difference_absolute)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({formatNumber(selectedAnalysis.difference_percent, 1)}%)
                    </p>
                  </div>
                </div>
              </div>

              {selectedAnalysis.diagnosis_items && selectedAnalysis.diagnosis_items.length > 0 && (
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="font-semibold mb-3">🔍 Diagnóstico Técnico</h4>
                  <ul className="space-y-2 text-sm">
                    {selectedAnalysis.diagnosis_items.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchAnalysisModal;
