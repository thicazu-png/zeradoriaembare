// Water tariff table (progressive by ranges)
export const WATER_TARIFF_TABLE = [
  { min: 0, max: 10, price: 2.41, label: "Até 10 m³" },
  { min: 11, max: 20, price: 6.05, label: "11–20 m³" },
  { min: 21, max: 30, price: 7.77, label: "21–30 m³" },
  { min: 31, max: 40, price: 9.81, label: "31–40 m³" },
  { min: 41, max: 50, price: 11.65, label: "41–50 m³" },
  { min: 51, max: 60, price: 12.78, label: "51–60 m³" },
  { min: 61, max: 9999, price: 14.16, label: "61+ m³" },
];

export interface TariffBreakdown {
  range: string;
  volume: number;
  price: number;
  subtotal: number;
}

export interface WaterBillCalculation {
  consumption: number;
  cycleDays: number;
  dailyConsumption: number;
  normalizedConsumption: number;
  waterValue: number;
  sewerValue: number;
  fixedFee: number;
  totalWithSewer: number;
  totalWithoutSewer: number;
  tariffBreakdown: TariffBreakdown[];
}

export interface HistoricalEntry {
  id: string;
  monthYear: string;
  consumption: number;
  cycleDays: number;
}

export interface ResidenceData {
  userName: string;
  cdcDv: string;
  previousReadingDate: Date | null;
  currentReadingDate: Date | null;
  previousReading: number;
  currentReading: number;
  chargedValue: number;
  fixedFee: number;
  includeSewer: boolean;
}

export const calculateWaterBill = (
  normalizedConsumption: number,
  includeSewer: boolean,
  fixedFee: number
): { waterValue: number; sewerValue: number; total: number; breakdown: TariffBreakdown[] } => {
  let remaining = normalizedConsumption;
  let waterValue = 0;
  const breakdown: TariffBreakdown[] = [];

  for (const tier of WATER_TARIFF_TABLE) {
    if (remaining <= 0) break;

    const tierSize = tier.max - tier.min + 1;
    const volumeInTier = Math.min(remaining, tierSize);
    const subtotal = volumeInTier * tier.price;

    if (volumeInTier > 0) {
      breakdown.push({
        range: tier.label,
        volume: volumeInTier,
        price: tier.price,
        subtotal,
      });
      waterValue += subtotal;
    }

    remaining -= volumeInTier;
  }

  const sewerValue = includeSewer ? waterValue : 0;
  const total = waterValue + sewerValue + fixedFee;

  return { waterValue, sewerValue, total, breakdown };
};

export const calculateCycleData = (
  previousDate: Date,
  currentDate: Date,
  previousReading: number,
  currentReading: number
): {
  cycleDays: number;
  consumption: number;
  dailyConsumption: number;
  normalizedConsumption: number;
} => {
  const cycleDays = Math.ceil(
    (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const consumption = currentReading - previousReading;
  const dailyConsumption = cycleDays > 0 ? consumption / cycleDays : 0;
  const normalizedConsumption = dailyConsumption * 30;

  return {
    cycleDays,
    consumption,
    dailyConsumption,
    normalizedConsumption,
  };
};

export const calculateHistoricalAverage = (
  entries: HistoricalEntry[],
  excludeJanuary: boolean = true
): { monthlyAverage: number; dailyAverage: number; validEntries: number } => {
  let filteredEntries = entries;

  if (excludeJanuary) {
    filteredEntries = entries.filter((entry) => {
      const month = entry.monthYear.split("/")[0];
      return month !== "01";
    });
  }

  if (filteredEntries.length === 0) {
    return { monthlyAverage: 0, dailyAverage: 0, validEntries: 0 };
  }

  const totalNormalized = filteredEntries.reduce((sum, entry) => {
    const daily = entry.cycleDays > 0 ? entry.consumption / entry.cycleDays : 0;
    return sum + daily * 30;
  }, 0);

  const monthlyAverage = totalNormalized / filteredEntries.length;
  const dailyAverage = monthlyAverage / 30;

  return {
    monthlyAverage,
    dailyAverage,
    validEntries: filteredEntries.length,
  };
};

export const classifyConsumption = (
  normalizedConsumption: number,
  historicalAverage: number
): {
  classification: "normal" | "elevated" | "anomalous";
  deviation: number;
  deviationPercent: number;
} => {
  const deviation = normalizedConsumption - historicalAverage;
  const deviationPercent =
    historicalAverage > 0 ? (deviation / historicalAverage) * 100 : 0;

  let classification: "normal" | "elevated" | "anomalous";

  if (deviationPercent <= 20) {
    classification = "normal";
  } else if (deviationPercent <= 50) {
    classification = "elevated";
  } else {
    classification = "anomalous";
  }

  return { classification, deviation, deviationPercent };
};

export type DiagnosisType = "warning" | "info" | "success" | "danger" | "money";

export interface DiagnosisItem {
  type: DiagnosisType;
  message: string;
}

export const generateDiagnosis = (
  cycleDays: number,
  normalizedConsumption: number,
  historicalAverage: number,
  chargedValue: number,
  calculatedTotal: number
): DiagnosisItem[] => {
  const diagnosis: DiagnosisItem[] = [];
  const { classification, deviationPercent } = classifyConsumption(
    normalizedConsumption,
    historicalAverage
  );

  // Reading delay distortion
  if (cycleDays > 30) {
    diagnosis.push({
      type: "warning",
      message: `Distorção por atraso de leitura: O ciclo teve ${cycleDays} dias (${cycleDays - 30} dias a mais que o padrão de 30 dias), o que pode ter inflacionado o consumo aparente.`
    });
  } else if (cycleDays < 28) {
    diagnosis.push({
      type: "info",
      message: `Ciclo reduzido: O período teve apenas ${cycleDays} dias, o que pode subestimar o consumo mensal real.`
    });
  }

  // Progressive tariff impact
  if (normalizedConsumption > 30) {
    diagnosis.push({
      type: "money",
      message: `Impacto da tarifa progressiva: Consumo de ${normalizedConsumption.toFixed(1)} m³ atinge faixas superiores com valores mais altos por m³.`
    });
  }

  // Statistical deviation
  if (historicalAverage > 0) {
    if (Math.abs(deviationPercent) > 10) {
      diagnosis.push({
        type: deviationPercent > 0 ? "warning" : "success",
        message: `Desvio estatístico: Consumo ${deviationPercent > 0 ? "acima" : "abaixo"} da média histórica em ${Math.abs(deviationPercent).toFixed(1)}%.`
      });
    }
  }

  // Consumption classification
  const classificationItems: Record<string, DiagnosisItem> = {
    normal: { type: "success", message: "Classificação: Consumo NORMAL dentro do padrão histórico." },
    elevated: { type: "warning", message: "Classificação: Consumo ELEVADO POR PERÍODO - pode indicar uso sazonal ou ciclo estendido." },
    anomalous: { type: "danger", message: "Classificação: Consumo ANÔMALO - desvio significativo que requer investigação." },
  };
  diagnosis.push(classificationItems[classification]);

  // Billing comparison
  const difference = chargedValue - calculatedTotal;
  if (Math.abs(difference) > 1) {
    if (difference > 0) {
      diagnosis.push({
        type: "danger",
        message: `Cobrança superior: Valor cobrado R$ ${chargedValue.toFixed(2)} excede o valor técnico R$ ${calculatedTotal.toFixed(2)} em R$ ${difference.toFixed(2)}.`
      });
    } else {
      diagnosis.push({
        type: "success",
        message: `Cobrança compatível: Valor cobrado está R$ ${Math.abs(difference).toFixed(2)} abaixo do cálculo técnico.`
      });
    }
  }

  return diagnosis;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals).replace(".", ",");
};
