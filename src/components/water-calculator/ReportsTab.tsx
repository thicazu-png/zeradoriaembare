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

  const classification = cycleData && historicalAverage.monthlyAverage > 0
    ? classifyConsumption(cycleData.normalizedConsumption, historicalAverage.monthlyAverage)
    : null;

  const generateDiscursiveSynthesis = (): string => {
    if (!cycleData || !billData) return "";

    const diff = data.chargedValue - billData.total;
    const diffPercent = billData.total > 0 ? (diff / billData.total) * 100 : 0;
    const cycleDiff = cycleData.cycleDays - 30;
    
    let synthesis = `SÍNTESE DISCURSIVA DA ANÁLISE\n\n`;
    
    // Introduction
    synthesis += `A presente análise técnica refere-se à conta de água do usuário ${data.userName || "não identificado"}, `;
    synthesis += `matrícula CDC-DV ${data.cdcDv || "não informada"}, correspondente ao período de `;
    synthesis += `${data.previousReadingDate?.toLocaleDateString("pt-BR")} a ${data.currentReadingDate?.toLocaleDateString("pt-BR")}.\n\n`;
    
    // Cycle analysis
    synthesis += `ANÁLISE DO CICLO DE FATURAMENTO\n`;
    synthesis += `O ciclo de faturamento analisado compreendeu ${cycleData.cycleDays} dias. `;
    
    if (cycleDiff > 0) {
      synthesis += `Este período excede o ciclo padrão de 30 dias em ${cycleDiff} dias, o que representa um `;
      synthesis += `acréscimo de ${formatNumber((cycleDiff / 30) * 100, 1)}% no tempo de medição. `;
      synthesis += `Esta extensão do ciclo impacta diretamente no volume registrado, pois há mais dias de consumo `;
      synthesis += `sendo contabilizados em uma única fatura, gerando distorção na percepção do consumo mensal real.\n\n`;
    } else if (cycleDiff < 0) {
      synthesis += `Este período é inferior ao ciclo padrão de 30 dias em ${Math.abs(cycleDiff)} dias, `;
      synthesis += `o que pode subestimar o consumo mensal efetivo.\n\n`;
    } else {
      synthesis += `Este período corresponde exatamente ao ciclo padrão de 30 dias, `;
      synthesis += `não havendo distorção temporal na medição.\n\n`;
    }
    
    // Consumption analysis
    synthesis += `ANÁLISE DO CONSUMO\n`;
    synthesis += `O consumo real registrado no hidrômetro foi de ${formatNumber(cycleData.consumption, 1)} m³ `;
    synthesis += `(diferença entre leitura atual de ${formatNumber(data.currentReading, 0)} m³ e anterior de ${formatNumber(data.previousReading, 0)} m³). `;
    synthesis += `O consumo médio diário calculado foi de ${formatNumber(cycleData.dailyConsumption, 3)} m³/dia.\n\n`;
    
    synthesis += `Para fins de comparação justa, o consumo foi normalizado para um período padrão de 30 dias, `;
    synthesis += `resultando em ${formatNumber(cycleData.normalizedConsumption, 1)} m³. `;
    synthesis += `Este valor representa o consumo equivalente mensal e é a base para o cálculo do valor técnico justo.\n\n`;
    
    // Historical comparison
    if (historicalAverage.monthlyAverage > 0 && classification) {
      synthesis += `COMPARAÇÃO COM HISTÓRICO\n`;
      synthesis += `Com base em ${historicalAverage.validEntries} meses de histórico (excluindo janeiros por sazonalidade), `;
      synthesis += `a média mensal de consumo do imóvel é de ${formatNumber(historicalAverage.monthlyAverage, 1)} m³. `;
      synthesis += `O consumo atual normalizado apresenta desvio de ${classification.deviationPercent > 0 ? "+" : ""}${formatNumber(classification.deviationPercent, 1)}% `;
      synthesis += `em relação a esta média (${classification.deviation > 0 ? "+" : ""}${formatNumber(classification.deviation, 1)} m³).\n\n`;
      
      const classificationLabels = {
        normal: "NORMAL - dentro do padrão histórico",
        elevated: "ELEVADO POR PERÍODO - pode indicar ciclo estendido ou uso sazonal",
        anomalous: "ANÔMALO - requer investigação de possíveis vazamentos ou irregularidades"
      };
      synthesis += `Classificação do consumo: ${classificationLabels[classification.classification]}.\n\n`;
    }
    
    // Tariff analysis
    synthesis += `ANÁLISE TARIFÁRIA\n`;
    synthesis += `Aplicando-se a tabela tarifária progressiva do SAAE sobre o consumo normalizado de `;
    synthesis += `${formatNumber(cycleData.normalizedConsumption, 1)} m³, obtém-se:\n`;
    synthesis += `- Valor da água: ${formatCurrency(billData.waterValue)}\n`;
    if (data.includeSewer) {
      synthesis += `- Valor do esgoto (100% da água): ${formatCurrency(billData.sewerValue)}\n`;
    }
    synthesis += `- Taxa fixa de resíduos: ${formatCurrency(data.fixedFee)}\n`;
    synthesis += `- VALOR TÉCNICO JUSTO TOTAL: ${formatCurrency(billData.total)}\n\n`;
    
    // Billing comparison - same format as COMPARAÇÃO COM HISTÓRICO
    synthesis += `RESULTADO DA ANÁLISE - DESTAQUES\n`;
    synthesis += `Consumo Normalizado (30 dias): ${formatNumber(cycleData.normalizedConsumption, 1)} m³. `;
    synthesis += `Valor Técnico Justo a ser Cobrado: ${formatCurrency(billData.total)}. `;
    synthesis += `Valor Efetivamente Cobrado na Conta: ${formatCurrency(data.chargedValue)}. `;
    synthesis += `Diferença: ${formatCurrency(diff)} (${formatNumber(diffPercent, 1)}%).\n\n`;
    
    // CONCLUSÃO section - will be rendered as highlighted box
    synthesis += `CONCLUSÃO_BOX_START\n`;
    if (Math.abs(diff) > 1) {
      if (diff > 0) {
        synthesis += `O valor cobrado na conta está ${formatCurrency(diff)} ACIMA do valor técnico justo. `;
        synthesis += `Esta diferença de ${formatNumber(diffPercent, 1)}% pode decorrer de: `;
        synthesis += `(1) Ciclo de faturamento superior a 30 dias (${cycleData.cycleDays} dias neste caso); `;
        synthesis += `(2) Inclusão de taxas ou multas não informadas; `;
        synthesis += `(3) Erro de cálculo na aplicação da tarifa progressiva. `;
        synthesis += `Recomenda-se verificar a composição detalhada da fatura junto ao SAAE e, `;
        synthesis += `se confirmada a cobrança indevida, solicitar revisão formal.`;
      } else {
        synthesis += `O valor cobrado está ${formatCurrency(Math.abs(diff))} ABAIXO do valor técnico calculado, `;
        synthesis += `indicando possível desconto, isenção ou benefício tarifário aplicado.`;
      }
    } else {
      synthesis += `O valor cobrado está compatível com o cálculo técnico, `;
      synthesis += `com diferença desprezível de ${formatCurrency(Math.abs(diff))}.`;
    }
    synthesis += `\nCONCLUSÃO_BOX_END`;
    
    return synthesis;
  };

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
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = autoTableModule.default;
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 20;

      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("RELATÓRIO TÉCNICO DE ANÁLISE", pageWidth / 2, currentY, { align: "center" });
      currentY += 6;
      doc.text("CONTA DE ÁGUA", pageWidth / 2, currentY, { align: "center" });
      currentY += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(108, 117, 125);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, pageWidth / 2, currentY, { align: "center" });
      currentY += 10;

      // User info box
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(14, currentY, pageWidth - 28, 24, 3, 3, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("IDENTIFICAÇÃO DO USUÁRIO", 20, currentY + 7);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Nome: ${data.userName || "Não informado"}`, 20, currentY + 14);
      doc.text(`CDC-DV (Matrícula): ${data.cdcDv || "Não informado"}`, 20, currentY + 20);
      currentY += 30;

      // Indicators section
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("INDICADORES DO CICLO", 14, currentY);
      currentY += 6;

      const indicatorsData = [
        ["Período de Leitura", `${data.previousReadingDate?.toLocaleDateString("pt-BR")} a ${data.currentReadingDate?.toLocaleDateString("pt-BR")}`],
        ["Dias do Ciclo", `${cycleData.cycleDays} dias ${cycleData.cycleDays > 30 ? `(+${cycleData.cycleDays - 30} dias extras)` : cycleData.cycleDays < 30 ? `(${cycleData.cycleDays - 30} dias)` : "(padrão)"}`],
        ["Leitura Anterior", `${formatNumber(data.previousReading, 0)} m³`],
        ["Leitura Atual", `${formatNumber(data.currentReading, 0)} m³`],
        ["Consumo Real (Período)", `${formatNumber(cycleData.consumption, 1)} m³`],
        ["Consumo Médio Diário", `${formatNumber(cycleData.dailyConsumption, 3)} m³/dia`],
        ["CONSUMO NORMALIZADO (30 dias)", `${formatNumber(cycleData.normalizedConsumption, 1)} m³`],
      ];

      if (historicalAverage.monthlyAverage > 0) {
        indicatorsData.push(["Média Histórica Mensal", `${formatNumber(historicalAverage.monthlyAverage, 1)} m³ (${historicalAverage.validEntries} meses)`]);
        if (classification) {
          const classLabel = classification.classification === "normal" ? "Normal" : classification.classification === "elevated" ? "Elevado" : "Anômalo";
          indicatorsData.push(["Desvio do Histórico", `${classification.deviationPercent > 0 ? "+" : ""}${formatNumber(classification.deviationPercent, 1)}% (${classLabel})`]);
        }
      }

      autoTable(doc, {
        startY: currentY,
        body: indicatorsData,
        theme: "plain",
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: 80 },
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Tariff breakdown
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DETALHAMENTO TARIFÁRIO PROGRESSIVO", 14, currentY);
      currentY += 6;

      const tableData = billData.breakdown.map((item) => [
        item.range,
        formatNumber(item.volume, 1) + " m³",
        formatCurrency(item.price) + "/m³",
        formatCurrency(item.subtotal),
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Faixa de Consumo", "Volume", "Preço Unitário", "Subtotal"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
        styles: { fontSize: 9 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Financial summary - HIGHLIGHTED BOX
      doc.setFillColor(254, 243, 199); // Yellow background
      doc.roundedRect(14, currentY, pageWidth - 28, 50, 3, 3, "F");
      doc.setDrawColor(251, 191, 36);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, currentY, pageWidth - 28, 50, 3, 3, "S");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(146, 64, 14);
      doc.text("RESUMO FINANCEIRO - VALORES EM DESTAQUE", pageWidth / 2, currentY + 7, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(33, 37, 41);
      let summaryY = currentY + 15;
      doc.text(`Valor da Água: ${formatCurrency(billData.waterValue)}`, 20, summaryY);
      doc.text(`Valor do Esgoto: ${formatCurrency(billData.sewerValue)}`, 110, summaryY);
      summaryY += 6;
      doc.text(`Taxa Fixa (Resíduos): ${formatCurrency(data.fixedFee)}`, 20, summaryY);
      summaryY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`VALOR TÉCNICO JUSTO: ${formatCurrency(billData.total)}`, 20, summaryY);
      doc.text(`VALOR COBRADO: ${formatCurrency(data.chargedValue)}`, 110, summaryY);
      summaryY += 8;

      const diff = data.chargedValue - billData.total;
      const diffPercent = billData.total > 0 ? (diff / billData.total) * 100 : 0;
      doc.setTextColor(diff > 0 ? 185 : 22, diff > 0 ? 28 : 163, diff > 0 ? 28 : 74);
      doc.text(`DIFERENÇA: ${formatCurrency(diff)} (${formatNumber(diffPercent, 1)}%)`, 20, summaryY);

      currentY += 56;

      // Diagnosis section - same formatting as SÍNTESE DISCURSIVA
      doc.addPage();
      currentY = 20;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("DIAGNÓSTICO TÉCNICO AUTOMÁTICO", pageWidth / 2, currentY, { align: "center" });
      currentY += 10;

      const diagnosis = generateDiagnosis(
        cycleData.cycleDays,
        cycleData.normalizedConsumption,
        historicalAverage.monthlyAverage,
        data.chargedValue,
        billData.total
      );

      // Apply same formatting as SÍNTESE DISCURSIVA DA ANÁLISE
      diagnosis.forEach((item) => {
        // Remove formatting characters and clean text
        const cleanText = item
          .replace(/[•►◆]/g, "")
          .replace(/[═─│┌┐└┘├┤┬┴┼]/g, "")
          .replace(/\*\*/g, "")
          .replace(/\s+/g, " ")
          .trim();
        
        if (!cleanText) return;
        
        // Check for section headers (all uppercase words)
        if (cleanText.match(/^[A-ZÇÃÉÍÓÚÂÊÔÀÈ\s-]+$/) && cleanText.length > 3) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(59, 130, 246); // Blue color for headers
          
          if (currentY + 8 > 275) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(cleanText, 14, currentY);
          currentY += 6;
        } else {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(33, 37, 41);
          
          const wrappedLines = doc.splitTextToSize(cleanText, pageWidth - 28);
          
          if (currentY + wrappedLines.length * 5 > 275) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(wrappedLines, 14, currentY);
          currentY += wrappedLines.length * 5 + 3;
        }
      });

      // New page for discursive synthesis
      doc.addPage();
      currentY = 20;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("SÍNTESE DISCURSIVA DA ANÁLISE", pageWidth / 2, currentY, { align: "center" });
      currentY += 10;

      // Generate and add discursive text
      const synthesis = generateDiscursiveSynthesis();
      const synthesisParts = synthesis.split("\n");
      
      let insideConclusionBox = false;
      let conclusionText = "";
      
      synthesisParts.forEach((line) => {
        // Handle conclusion box markers
        if (line.includes("CONCLUSÃO_BOX_START")) {
          insideConclusionBox = true;
          conclusionText = "";
          return;
        }
        
        if (line.includes("CONCLUSÃO_BOX_END")) {
          insideConclusionBox = false;
          
          // Draw conclusion box similar to RESUMO FINANCEIRO
          if (currentY + 40 > 275) {
            doc.addPage();
            currentY = 20;
          }
          
          const boxHeight = 35;
          doc.setFillColor(254, 243, 199); // Yellow background
          doc.roundedRect(14, currentY, pageWidth - 28, boxHeight, 3, 3, "F");
          doc.setDrawColor(251, 191, 36);
          doc.setLineWidth(0.5);
          doc.roundedRect(14, currentY, pageWidth - 28, boxHeight, 3, 3, "S");
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(146, 64, 14);
          doc.text("CONCLUSÃO", pageWidth / 2, currentY + 7, { align: "center" });
          
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(33, 37, 41);
          const conclusionLines = doc.splitTextToSize(conclusionText.trim(), pageWidth - 36);
          doc.text(conclusionLines, 18, currentY + 14);
          
          currentY += boxHeight + 6;
          return;
        }
        
        if (insideConclusionBox) {
          conclusionText += line + " ";
          return;
        }
        
        // Clean formatting characters
        const cleanLine = line
          .replace(/[═─│┌┐└┘├┤┬┴┼]/g, "")
          .replace(/[►•◆]/g, "")
          .trim();
        
        if (!cleanLine) return;
        
        // Check for section headers (all uppercase words)
        if (cleanLine.match(/^[A-ZÇÃÉÍÓÚÂÊÔÀÈ\s-]+$/) && cleanLine.length > 3) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(59, 130, 246);
          
          if (currentY + 8 > 275) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(cleanLine, 14, currentY);
          currentY += 6;
        } else {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(33, 37, 41);
          
          const wrappedLines = doc.splitTextToSize(cleanLine, pageWidth - 28);
          
          if (currentY + wrappedLines.length * 5 > 275) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(wrappedLines, 14, currentY);
          currentY += wrappedLines.length * 5 + 3;
        }
      });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(108, 117, 125);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: "center" });
        doc.text("Relatório gerado pelo Sistema de Análise de Contas de Água - AMBJE", pageWidth / 2, 285, { align: "center" });
      }

      doc.save(`relatorio-tecnico-agua-${data.cdcDv || "sem-cdc"}.pdf`);

      toast({
        title: "Relatório gerado com sucesso!",
        description: "PDF completo com síntese discursiva foi baixado.",
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
        
        <div className="flex justify-center">
          <Button
            onClick={generatePDF}
            disabled={!hasValidData || isGenerating}
            className="h-auto py-4 px-8 flex-col gap-2"
          >
            <FileText className="h-6 w-6" />
            <span>Relatório Técnico Individual</span>
            <span className="text-xs opacity-80">PDF completo com análise</span>
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
