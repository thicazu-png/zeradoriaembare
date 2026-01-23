import { useState } from "react";
import { FileText, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  calculateWaterBill,
  calculateCycleData,
  calculateHistoricalAverage,
  classifyConsumption,
  generateDiagnosis,
  formatCurrency,
  formatNumber,
  WATER_TARIFF_TABLE,
  type ResidenceData,
  type HistoricalEntry,
} from "@/lib/waterTariff";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";

interface ReportsTabProps {
  data: ResidenceData;
  historicalEntries: HistoricalEntry[];
}

const ReportsTab = ({ data, historicalEntries }: ReportsTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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

  // Chart data
  const historicalChartData = historicalEntries
    .filter((e) => !e.monthYear.startsWith("01/"))
    .map((entry) => ({
      month: entry.monthYear,
      consumo: entry.consumption,
      normalizado: entry.cycleDays > 0 ? (entry.consumption / entry.cycleDays) * 30 : 0,
    }));

  const generatePDF = async () => {
    if (!cycleData || !billData) {
      toast({
        title: "Dados insuficientes",
        description: "Preencha todos os dados antes de gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(33, 37, 41);
      doc.text("Relatório Técnico de Análise de Conta de Água", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, 28, { align: "center" });

      // User info
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.text("Dados do Usuário", 14, 40);
      
      doc.setFontSize(10);
      doc.text(`Nome: ${data.userName || "Não informado"}`, 14, 48);
      doc.text(`CDC-DV: ${data.cdcDv || "Não informado"}`, 14, 54);

      // Cycle data
      doc.setFontSize(12);
      doc.text("Dados do Ciclo", 14, 68);
      
      doc.setFontSize(10);
      doc.text(`Período: ${data.previousReadingDate?.toLocaleDateString("pt-BR")} a ${data.currentReadingDate?.toLocaleDateString("pt-BR")}`, 14, 76);
      doc.text(`Dias do Ciclo: ${cycleData.cycleDays}`, 14, 82);
      doc.text(`Consumo Real: ${formatNumber(cycleData.consumption, 1)} m³`, 14, 88);
      doc.text(`Consumo Normalizado (30 dias): ${formatNumber(cycleData.normalizedConsumption, 1)} m³`, 14, 94);

      // Tariff breakdown
      doc.setFontSize(12);
      doc.text("Detalhamento Tarifário", 14, 108);

      const tableData = billData.breakdown.map((item) => [
        item.range,
        formatNumber(item.volume, 1),
        formatCurrency(item.price),
        formatCurrency(item.subtotal),
      ]);

      (doc as any).autoTable({
        startY: 114,
        head: [["Faixa", "Volume (m³)", "Preço/m³", "Subtotal"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Summary
      doc.setFontSize(12);
      doc.text("Resumo Financeiro", 14, finalY);
      
      doc.setFontSize(10);
      doc.text(`Valor da Água: ${formatCurrency(billData.waterValue)}`, 14, finalY + 8);
      doc.text(`Valor do Esgoto: ${formatCurrency(billData.sewerValue)}`, 14, finalY + 14);
      doc.text(`Taxa Fixa: ${formatCurrency(data.fixedFee)}`, 14, finalY + 20);
      doc.text(`Total Técnico Justo: ${formatCurrency(billData.total)}`, 14, finalY + 26);
      doc.text(`Valor Cobrado: ${formatCurrency(data.chargedValue)}`, 14, finalY + 32);
      
      const diff = data.chargedValue - billData.total;
      doc.setTextColor(diff > 0 ? 220 : 40, diff > 0 ? 53 : 167, diff > 0 ? 69 : 69);
      doc.text(`Diferença: ${formatCurrency(diff)} (${formatNumber((diff / billData.total) * 100, 1)}%)`, 14, finalY + 38);

      // Diagnosis
      doc.setTextColor(33, 37, 41);
      doc.setFontSize(12);
      doc.text("Diagnóstico Técnico", 14, finalY + 52);

      const diagnosis = generateDiagnosis(
        cycleData.cycleDays,
        cycleData.normalizedConsumption,
        historicalAverage.monthlyAverage,
        data.chargedValue,
        billData.total
      );

      doc.setFontSize(9);
      let diagY = finalY + 60;
      diagnosis.forEach((item) => {
        const lines = doc.splitTextToSize(item, pageWidth - 28);
        doc.text(lines, 14, diagY);
        diagY += lines.length * 5 + 3;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(108, 117, 125);
      doc.text("Relatório gerado pelo Sistema de Análise de Contas de Água - AMBJE", pageWidth / 2, 285, { align: "center" });

      doc.save(`relatorio-conta-agua-${data.cdcDv || "sem-cdc"}.pdf`);

      toast({
        title: "Relatório gerado!",
        description: "O PDF foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">📄 Relatórios Disponíveis</h3>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={generatePDF}
            disabled={!hasValidData || isGenerating}
            className="h-auto py-4 flex-col gap-2"
          >
            <FileText className="h-6 w-6" />
            <span>Relatório Técnico Individual</span>
            <span className="text-xs opacity-80">PDF completo com análise</span>
          </Button>

          <Button
            variant="outline"
            disabled={historicalEntries.length === 0}
            className="h-auto py-4 flex-col gap-2"
            onClick={() => {
              toast({
                title: "Em breve",
                description: "Relatório comparativo será disponibilizado em breve.",
              });
            }}
          >
            <BarChart3 className="h-6 w-6" />
            <span>Relatório Comparativo</span>
            <span className="text-xs opacity-80">Análise histórica</span>
          </Button>
        </div>
      </div>

      {historicalEntries.length > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4">📊 Consumo Histórico</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: number) => [`${formatNumber(value, 1)} m³`, ""]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Legend />
                <Bar dataKey="consumo" fill="hsl(var(--primary))" name="Consumo Real" />
                <Bar dataKey="normalizado" fill="hsl(var(--primary) / 0.5)" name="Normalizado 30d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {historicalEntries.length > 0 && historicalAverage.monthlyAverage > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4">📈 Consumo Normalizado vs Média</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: number) => [`${formatNumber(value, 1)} m³`, ""]}
                />
                <Legend />
                <ReferenceLine 
                  y={historicalAverage.monthlyAverage} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  label={{ value: `Média: ${formatNumber(historicalAverage.monthlyAverage, 1)}`, fill: 'hsl(var(--destructive))', fontSize: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="normalizado" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                  name="Consumo Normalizado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!hasValidData && (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <Download className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Preencha os dados nas abas anteriores para gerar relatórios.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
