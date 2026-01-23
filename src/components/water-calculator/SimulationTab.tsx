import { HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  WATER_TARIFF_TABLE,
  calculateWaterBill,
  calculateCycleData,
  formatCurrency,
  formatNumber,
  type ResidenceData,
} from "@/lib/waterTariff";

interface SimulationTabProps {
  data: ResidenceData;
}

const SimulationTab = ({ data }: SimulationTabProps) => {
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

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4">📋 Tabela Tarifária de Água (Progressiva)</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faixa de Consumo</TableHead>
              <TableHead className="text-right">Valor por m³</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WATER_TARIFF_TABLE.map((tier) => (
              <TableRow key={tier.label}>
                <TableCell>{tier.label}</TableCell>
                <TableCell className="text-right">{formatCurrency(tier.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!hasValidData && (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Preencha os dados na aba "Entrada de Dados" para ver a simulação tarifária.
          </p>
        </div>
      )}

      {hasValidData && cycleData && billData && (
        <>
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-4">📊 Cálculos do Ciclo</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{cycleData.cycleDays}</p>
                <p className="text-xs text-muted-foreground">Dias do Ciclo</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{formatNumber(cycleData.consumption, 1)}</p>
                <p className="text-xs text-muted-foreground">Consumo do Ciclo (m³)</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{formatNumber(cycleData.dailyConsumption, 3)}</p>
                <p className="text-xs text-muted-foreground">Consumo Diário (m³)</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                <p className="text-2xl font-bold text-primary">{formatNumber(cycleData.normalizedConsumption, 1)}</p>
                <p className="text-xs text-muted-foreground">Consumo Normalizado (30 dias)</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-4">💰 Simulação Tarifária</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faixa</TableHead>
                  <TableHead className="text-right">Volume (m³)</TableHead>
                  <TableHead className="text-right">Preço/m³</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billData.breakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.range}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.volume, 1)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-medium">Total Água</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(billData.waterValue)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-foreground">📝 Resumo do Valor Técnico Justo</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm">
                  <h4 className="font-semibold mb-2">O que é o Valor Técnico Justo?</h4>
                  <p className="text-muted-foreground">
                    É o valor calculado aplicando-se a tabela tarifária oficial do SAAE sobre o 
                    <strong> consumo normalizado para 30 dias</strong>, considerando sua média histórica informada. 
                    Isso corrige distorções causadas por ciclos de leitura irregulares (maiores ou menores que 30 dias), 
                    permitindo uma comparação justa com o valor efetivamente cobrado na conta.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor da Água:</span>
                <span className="font-medium">{formatCurrency(billData.waterValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor do Esgoto (100% água):</span>
                <span className="font-medium">{formatCurrency(billData.sewerValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa Fixa (Resíduos):</span>
                <span className="font-medium">{formatCurrency(data.fixedFee)}</span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between text-base">
                <span className="font-medium">Total sem Esgoto:</span>
                <span className="font-bold">{formatCurrency(billData.waterValue + data.fixedFee)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-medium">Total com Esgoto:</span>
                <span className="font-bold text-primary">{formatCurrency(billData.total)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimulationTab;
