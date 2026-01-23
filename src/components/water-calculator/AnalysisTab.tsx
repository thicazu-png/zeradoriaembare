import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  calculateWaterBill,
  calculateCycleData,
  calculateHistoricalAverage,
  classifyConsumption,
  generateDiagnosis,
  formatNumber,
  type ResidenceData,
  type HistoricalEntry,
} from "@/lib/waterTariff";

interface AnalysisTabProps {
  data: ResidenceData;
  historicalEntries: HistoricalEntry[];
}

const AnalysisTab = ({ data, historicalEntries }: AnalysisTabProps) => {
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

  const classification = cycleData && historicalAverage.monthlyAverage > 0
    ? classifyConsumption(cycleData.normalizedConsumption, historicalAverage.monthlyAverage)
    : null;

  const diagnosis = cycleData && billData
    ? generateDiagnosis(
        cycleData.cycleDays,
        cycleData.normalizedConsumption,
        historicalAverage.monthlyAverage,
        data.chargedValue,
        billData.total
      )
    : [];

  if (!hasValidData || !cycleData) {
    return (
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          Preencha os dados na aba "Entrada de Dados" para ver a análise técnica.
        </p>
      </div>
    );
  }

  const getClassificationIcon = () => {
    if (!classification) return <Info className="h-5 w-5 text-muted-foreground" />;
    
    switch (classification.classification) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "elevated":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case "anomalous":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  const getClassificationLabel = () => {
    if (!classification) return "Sem dados históricos";
    
    switch (classification.classification) {
      case "normal":
        return "Consumo Normal";
      case "elevated":
        return "Consumo Elevado por Período";
      case "anomalous":
        return "Consumo Anômalo";
    }
  };

  const getClassificationColor = () => {
    if (!classification) return "bg-muted/50";
    
    switch (classification.classification) {
      case "normal":
        return "bg-green-500/10 border-green-500/20";
      case "elevated":
        return "bg-amber-500/10 border-amber-500/20";
      case "anomalous":
        return "bg-destructive/10 border-destructive/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-lg p-4 border ${getClassificationColor()}`}>
        <div className="flex items-center gap-3 mb-2">
          {getClassificationIcon()}
          <h3 className="font-semibold text-foreground">{getClassificationLabel()}</h3>
        </div>
        {classification && (
          <p className="text-sm text-muted-foreground">
            Desvio de {classification.deviationPercent > 0 ? "+" : ""}{formatNumber(classification.deviationPercent, 1)}% 
            em relação à média histórica ({formatNumber(classification.deviation, 1)} m³).
          </p>
        )}
        {!classification && (
          <p className="text-sm text-muted-foreground">
            Adicione dados históricos na aba "Histórico" para classificar o consumo.
          </p>
        )}
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">🔍 Diagnóstico Automático</h3>
        
        {diagnosis.length > 0 ? (
          <div className="space-y-3">
            {diagnosis.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Preencha mais dados para gerar o diagnóstico completo.
          </p>
        )}
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">📈 Indicadores do Ciclo</h3>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`rounded-lg p-3 text-center ${cycleData.cycleDays > 30 ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/50"}`}>
            <p className={`text-2xl font-bold ${cycleData.cycleDays > 30 ? "text-amber-600" : "text-foreground"}`}>
              {cycleData.cycleDays}
            </p>
            <p className="text-xs text-muted-foreground">Dias do Ciclo</p>
            {cycleData.cycleDays > 30 && (
              <p className="text-xs text-amber-600 mt-1">+{cycleData.cycleDays - 30} dias extras</p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{formatNumber(cycleData.consumption, 1)}</p>
            <p className="text-xs text-muted-foreground">Consumo Real (m³)</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{formatNumber(cycleData.dailyConsumption, 3)}</p>
            <p className="text-xs text-muted-foreground">Consumo/Dia (m³)</p>
          </div>

          <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
            <p className="text-2xl font-bold text-primary">{formatNumber(cycleData.normalizedConsumption, 1)}</p>
            <p className="text-xs text-muted-foreground">Normalizado 30d (m³)</p>
          </div>
        </div>
      </div>

      {historicalAverage.validEntries > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4">📊 Comparação com Histórico</h3>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{formatNumber(cycleData.normalizedConsumption, 1)} m³</p>
              <p className="text-xs text-muted-foreground">Consumo Atual</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">{formatNumber(historicalAverage.monthlyAverage, 1)} m³</p>
              <p className="text-xs text-muted-foreground">Média Histórica</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${classification && classification.deviation > 0 ? "text-destructive" : "text-green-600"}`}>
                {classification && classification.deviation > 0 ? "+" : ""}{formatNumber(classification?.deviation || 0, 1)} m³
              </p>
              <p className="text-xs text-muted-foreground">Diferença</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTab;
