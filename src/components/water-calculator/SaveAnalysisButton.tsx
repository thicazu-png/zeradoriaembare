import { useState } from "react";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  calculateWaterBill,
  calculateCycleData,
  calculateHistoricalAverage,
  generateDiagnosis,
  type ResidenceData,
  type HistoricalEntry,
} from "@/lib/waterTariff";

interface SaveAnalysisButtonProps {
  data: ResidenceData;
  historicalEntries: HistoricalEntry[];
}

const SaveAnalysisButton = ({ data, historicalEntries }: SaveAnalysisButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const hasValidData =
    data.previousReadingDate &&
    data.currentReadingDate &&
    data.currentReading > data.previousReading &&
    data.userName.trim() !== "" &&
    data.cdcDv.trim() !== "";

  const handleSave = async () => {
    if (!hasValidData || !data.previousReadingDate || !data.currentReadingDate) {
      toast({
        title: "Dados incompletos",
        description: "Preencha nome, CDC e dados de leitura antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const cycleData = calculateCycleData(
        data.previousReadingDate,
        data.currentReadingDate,
        data.previousReading,
        data.currentReading
      );

      const billData = calculateWaterBill(
        cycleData.normalizedConsumption,
        data.includeSewer,
        data.fixedFee
      );

      const historicalAverage = calculateHistoricalAverage(historicalEntries, true);
      
      const volumeAnomaly = historicalAverage.monthlyAverage > 0
        ? cycleData.normalizedConsumption - historicalAverage.monthlyAverage
        : null;

      const diffAbsolute = data.chargedValue - billData.total;
      const diffPercent = billData.total > 0 ? (diffAbsolute / billData.total) * 100 : 0;

      const diagnosis = generateDiagnosis(
        cycleData.cycleDays,
        cycleData.normalizedConsumption,
        historicalAverage.monthlyAverage,
        data.chargedValue,
        billData.total
      );

      const { error } = await supabase.from("water_analyses").insert([{
        user_name: data.userName,
        cdc_dv: data.cdcDv,
        previous_reading_date: data.previousReadingDate.toISOString().split("T")[0],
        current_reading_date: data.currentReadingDate.toISOString().split("T")[0],
        previous_reading: data.previousReading,
        current_reading: data.currentReading,
        charged_value: data.chargedValue,
        fixed_fee: data.fixedFee,
        include_sewer: data.includeSewer,
        cycle_days: cycleData.cycleDays,
        consumption: cycleData.consumption,
        daily_consumption: cycleData.dailyConsumption,
        normalized_consumption: cycleData.normalizedConsumption,
        water_value: billData.waterValue,
        sewer_value: billData.sewerValue,
        total_technical_value: billData.total,
        difference_absolute: diffAbsolute,
        difference_percent: diffPercent,
        historical_average: historicalAverage.monthlyAverage || null,
        volume_anomaly: volumeAnomaly,
        diagnosis_items: diagnosis as unknown as import("@/integrations/supabase/types").Json,
        tariff_breakdown: billData.breakdown as unknown as import("@/integrations/supabase/types").Json,
        historical_entries: historicalEntries as unknown as import("@/integrations/supabase/types").Json,
      }]);

      if (error) throw error;

      setSaved(true);
      toast({
        title: "Análise salva!",
        description: "Sua análise foi salva com sucesso no banco de dados.",
      });

      // Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={!hasValidData || isSaving}
      variant={saved ? "default" : "outline"}
      className="gap-2"
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : saved ? (
        <>
          <Check className="h-4 w-4" />
          Salvo!
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Salvar Análise
        </>
      )}
    </Button>
  );
};

export default SaveAnalysisButton;
