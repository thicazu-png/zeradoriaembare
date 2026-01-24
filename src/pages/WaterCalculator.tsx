import { useState } from "react";
import { ArrowLeft, Calculator, FileSpreadsheet, BarChart3, GitCompare, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoSaae from "@/assets/logo-saae.png";
import DataEntryTab from "@/components/water-calculator/DataEntryTab";
import HistoryTab from "@/components/water-calculator/HistoryTab";
import SimulationTab from "@/components/water-calculator/SimulationTab";
import ComparisonTab from "@/components/water-calculator/ComparisonTab";
import AnalysisTab from "@/components/water-calculator/AnalysisTab";
import ReportsTab from "@/components/water-calculator/ReportsTab";
import SaveAnalysisButton from "@/components/water-calculator/SaveAnalysisButton";


import type { ResidenceData, HistoricalEntry } from "@/lib/waterTariff";

const initialResidenceData: ResidenceData = {
  userName: "",
  cdcDv: "",
  previousReadingDate: null,
  currentReadingDate: null,
  previousReading: 0,
  currentReading: 0,
  chargedValue: 0,
  fixedFee: 25.0,
  includeSewer: true,
};

const WaterCalculator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("entrada");
  const [residenceData, setResidenceData] = useState<ResidenceData>(initialResidenceData);
  const [historicalEntries, setHistoricalEntries] = useState<HistoricalEntry[]>([]);

  const handleResidenceDataChange = (data: Partial<ResidenceData>) => {
    setResidenceData((prev) => ({ ...prev, ...data }));
  };

  const tabs = [
    { id: "entrada", label: "Entrada", icon: FileSpreadsheet },
    { id: "historico", label: "Histórico", icon: BarChart3 },
    { id: "simulacao", label: "Simulação", icon: Calculator },
    { id: "comparacao", label: "Comparação", icon: GitCompare },
    { id: "analise", label: "Análise", icon: Search },
    { id: "relatorios", label: "Relatórios", icon: FileText },
  ];

  return (
    <div
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
      className="min-h-screen bg-cover bg-center bg-fixed"
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-saae-blue to-saae-blue/90 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={() => navigate("/")}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl h-12 w-12 p-0 shadow-md transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <img src={logoSaae} alt="SAAE" className="h-12 w-auto drop-shadow-md" />
            <div className="flex-1">
              <h1 className="text-base font-bold text-white drop-shadow-sm">Análise de Conta de Água</h1>
              <p className="text-xs text-white/80">Calculadora Técnica SAAE</p>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-4 pb-safe">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-auto grid grid-cols-3 gap-2 bg-white/60 backdrop-blur-md p-3 rounded-xl shadow-md border border-white/40">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center justify-center gap-1 min-h-[60px] text-xs py-3 px-3 rounded-lg font-semibold transition-all duration-200 
                    bg-white/50 hover:bg-white/80 border border-transparent hover:border-green-500/30 hover:shadow-sm
                    data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-green-700 data-[state=active]:scale-[1.02]"
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[10px] sm:text-xs leading-tight text-center">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              <TabsContent value="entrada" className="mt-0">
                <DataEntryTab data={residenceData} onChange={handleResidenceDataChange} />
              </TabsContent>

              <TabsContent value="historico" className="mt-0">
                <HistoryTab entries={historicalEntries} onChange={setHistoricalEntries} />
              </TabsContent>

              <TabsContent value="simulacao" className="mt-0">
                <SimulationTab data={residenceData} />
              </TabsContent>

              <TabsContent value="comparacao" className="mt-0">
                <ComparisonTab data={residenceData} historicalEntries={historicalEntries} />
              </TabsContent>

              <TabsContent value="analise" className="mt-0">
                <AnalysisTab data={residenceData} historicalEntries={historicalEntries} />
              </TabsContent>

              <TabsContent value="relatorios" className="mt-0">
                <ReportsTab data={residenceData} historicalEntries={historicalEntries} />
              </TabsContent>

            </div>
          </Tabs>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <SaveAnalysisButton data={residenceData} historicalEntries={historicalEntries} />
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              Ferramenta técnica para cidadãos, comunidades, associações de bairro, 
              auditoria de faturamento, controle social do serviço público, 
              demandas administrativas, ações coletivas, análise jurídica e defesa do consumidor.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WaterCalculator;
