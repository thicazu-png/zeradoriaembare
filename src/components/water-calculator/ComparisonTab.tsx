import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  calculateWaterBill,
  calculateCycleData,
  calculateHistoricalAverage,
  formatCurrency,
  formatNumber,
  type ResidenceData,
  type HistoricalEntry,
} from "@/lib/waterTariff";

interface ComparisonTabProps {
  data: ResidenceData;
  historicalEntries: HistoricalEntry[];
}

const ComparisonTab = ({ data, historicalEntries }: ComparisonTabProps) => {
  const hasValidData =
    data.previousReadingDate &&
    data.currentReadingDate &&
    data.currentReading > data.previousReading;

  const cycleData = hasValidData
    ? calculateCycleData(
        data.previousReadingDate!,
        data.currentReadingDate!,
        data.previousReading,
        data.currentReading
      )
    : null;

  const billData = cycleData
    ? calculateWaterBill(cycleData.normalizedConsumption, data.includeSewer, data.fixedFee)
    : null;

  const historicalAverage = calculateHistoricalAverage(historicalEntries, true);

  const volumeAnomalo = cycleData && historicalAverage.monthlyAverage > 0
    ? cycleData.normalizedConsumption - historicalAverage.monthlyAverage
    : null;

  const diffAbsolute = billData ? data.chargedValue - billData.total : 0;
  const diffPercent = billData && billData.total > 0 ? (diffAbsolute / billData.total) * 100 : 0;

  if (!hasValidData || !cycleData || !billData) {
    return (
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          Preencha os dados na aba "Entrada de Dados" para ver a comparação.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">📊 Módulo Comparativo</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Valor Cobrado</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(data.chargedValue)}</p>
          </div>
          
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Valor Técnico Justo</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(billData.total)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className={`rounded-lg p-4 ${diffAbsolute > 0 ? "bg-destructive/10 border border-destructive/20" : diffAbsolute < 0 ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50"}`}>
            <div className="flex items-center gap-2 mb-1">
              {diffAbsolute > 0 ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : diffAbsolute < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">Diferença (R$)</p>
            </div>
            <p className={`text-xl font-bold ${diffAbsolute > 0 ? "text-destructive" : diffAbsolute < 0 ? "text-green-600" : "text-foreground"}`}>
              {diffAbsolute > 0 ? "+" : ""}{formatCurrency(diffAbsolute)}
            </p>
          </div>

          <div className={`rounded-lg p-4 ${diffPercent > 0 ? "bg-destructive/10 border border-destructive/20" : diffPercent < 0 ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50"}`}>
            <div className="flex items-center gap-2 mb-1">
              {diffPercent > 0 ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : diffPercent < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">Diferença (%)</p>
            </div>
            <p className={`text-xl font-bold ${diffPercent > 0 ? "text-destructive" : diffPercent < 0 ? "text-green-600" : "text-foreground"}`}>
              {diffPercent > 0 ? "+" : ""}{formatNumber(diffPercent, 1)}%
            </p>
          </div>

          <div className={`rounded-lg p-4 ${volumeAnomalo && volumeAnomalo > 5 ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/50"}`}>
            <p className="text-sm text-muted-foreground mb-1">Volume Anômalo (m³)</p>
            <p className={`text-xl font-bold ${volumeAnomalo && volumeAnomalo > 5 ? "text-amber-600" : "text-foreground"}`}>
              {volumeAnomalo !== null ? (
                <>
                  {volumeAnomalo > 0 ? "+" : ""}{formatNumber(volumeAnomalo, 1)}
                </>
              ) : (
                "—"
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {historicalAverage.monthlyAverage > 0 
                ? `Média histórica: ${formatNumber(historicalAverage.monthlyAverage, 1)} m³`
                : "Adicione histórico para calcular"}
            </p>
          </div>
        </div>
      </div>

      {diffAbsolute > 0 && (
        <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
          <h4 className="font-medium text-destructive mb-2">⚠️ Cobrança Acima do Valor Técnico</h4>
          <p className="text-sm text-foreground">
            O valor cobrado está <strong>{formatCurrency(diffAbsolute)}</strong> ({formatNumber(diffPercent, 1)}%) acima do valor técnico calculado.
            Isso pode indicar erro na leitura, aplicação incorreta de tarifa ou outras distorções.
          </p>
        </div>
      )}

      {volumeAnomalo !== null && volumeAnomalo > 10 && (
        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
          <h4 className="font-medium text-amber-700 mb-2">🔍 Volume Consumido Acima da Média</h4>
          <p className="text-sm text-foreground">
            O consumo normalizado está <strong>{formatNumber(volumeAnomalo, 1)} m³</strong> acima da sua média histórica.
            Verifique possíveis vazamentos ou uso atípico no período.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonTab;
