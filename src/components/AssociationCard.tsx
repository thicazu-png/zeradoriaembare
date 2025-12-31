import { useState } from "react";
import { Users, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const TOTAL_STEPS = 5;

const initialFormData = {
  // Step 1 - Dados Pessoais
  nome: "",
  rg: "",
  orgaoExp: "",
  dataNasc: undefined as Date | undefined,
  localNasc: "",
  nacionalidade: "",
  estadoCivil: "",
  profissao: "",
  // Step 2 - Endereço e Contatos
  logradouro: "",
  numero: "",
  email: "",
  telResidencial: "",
  celular: "",
  contatoEmergencia: "",
  // Step 3 - Família
  temMaiores: "",
  nomesMaiores: "",
  qtdMenores: 0,
  // Step 4 - Termos
  termoAdesao: false,
  termoLGPD: false,
  // Step 5 - Pagamento
  formaPagamento: "",
};

const AssociationCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dataNasc: date }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.nome.trim() || !formData.rg.trim()) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha Nome Completo e RG.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.numero.trim() || !formData.email.trim() || !formData.celular.trim()) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha Número, E-mail e Celular.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.termoAdesao || !formData.termoLGPD) {
          toast({
            title: "Termos obrigatórios",
            description: "Você precisa aceitar os termos para continuar.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 5:
        if (!formData.formaPagamento) {
          toast({
            title: "Campo obrigatório",
            description: "Selecione a forma de pagamento.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    const payload = {
      source: "associacao",
      nome: formData.nome.trim(),
      rg: formData.rg.trim(),
      orgaoExp: formData.orgaoExp.trim(),
      dataNasc: formData.dataNasc ? format(formData.dataNasc, "dd/MM/yyyy") : "",
      localNasc: formData.localNasc.trim(),
      nacionalidade: formData.nacionalidade.trim(),
      estadoCivil: formData.estadoCivil,
      profissao: formData.profissao.trim(),
      logradouro: formData.logradouro.trim(),
      numero: formData.numero.trim(),
      email: formData.email.trim(),
      telResidencial: formData.telResidencial.trim(),
      celular: formData.celular.trim(),
      contatoEmergencia: formData.contatoEmergencia.trim(),
      temMaiores: formData.temMaiores,
      nomesMaiores: formData.nomesMaiores.trim(),
      qtdMenores: formData.qtdMenores,
      termoAdesao: formData.termoAdesao,
      termoLGPD: formData.termoLGPD,
      formaPagamento: formData.formaPagamento,
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo à Associação de Moradores.",
      });

      setFormData(initialFormData);
      setCurrentStep(1);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentStep(1);
      setFormData(initialFormData);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
            i + 1 === currentStep
              ? "bg-primary text-primary-foreground"
              : i + 1 < currentStep
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Seja nosso parceiro! São somente R$15/mês.
      </p>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo <span className="text-destructive">*</span></Label>
          <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Seu nome completo" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="rg">RG <span className="text-destructive">*</span></Label>
            <Input id="rg" name="rg" value={formData.rg} onChange={handleInputChange} placeholder="00.000.000-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgaoExp">Órgão Expedidor</Label>
            <Input id="orgaoExp" name="orgaoExp" value={formData.orgaoExp} onChange={handleInputChange} placeholder="SSP/SP" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Data de Nascimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.dataNasc && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dataNasc ? format(formData.dataNasc, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dataNasc}
                onSelect={handleDateChange}
                initialFocus
                className="pointer-events-auto"
                captionLayout="dropdown-buttons"
                fromYear={1920}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="localNasc">Naturalidade</Label>
            <Input id="localNasc" name="localNasc" value={formData.localNasc} onChange={handleInputChange} placeholder="Cidade/Estado" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input id="nacionalidade" name="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange} placeholder="Brasileiro(a)" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Estado Civil</Label>
            <Select value={formData.estadoCivil} onValueChange={(v) => handleSelectChange("estadoCivil", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input id="profissao" name="profissao" value={formData.profissao} onChange={handleInputChange} placeholder="Sua profissão" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleInputChange} placeholder="Rua, Avenida..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero">Número <span className="text-destructive">*</span></Label>
          <Input id="numero" name="numero" value={formData.numero} onChange={handleInputChange} placeholder="123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="telResidencial">Tel. Residencial</Label>
            <Input id="telResidencial" name="telResidencial" value={formData.telResidencial} onChange={handleInputChange} placeholder="(00) 0000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="celular">Celular / WhatsApp <span className="text-destructive">*</span></Label>
            <Input id="celular" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="(00) 00000-0000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contatoEmergencia">Contato de Emergência</Label>
          <Input id="contatoEmergencia" name="contatoEmergencia" value={formData.contatoEmergencia} onChange={handleInputChange} placeholder="Nome e telefone" />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Há maiores de idade na residência?</Label>
        <RadioGroup value={formData.temMaiores} onValueChange={(v) => handleSelectChange("temMaiores", v)} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id="temMaiores-sim" />
            <Label htmlFor="temMaiores-sim" className="font-normal">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id="temMaiores-nao" />
            <Label htmlFor="temMaiores-nao" className="font-normal">Não</Label>
          </div>
        </RadioGroup>
      </div>
      {formData.temMaiores === "sim" && (
        <div className="space-y-2">
          <Label htmlFor="nomesMaiores">Nome completo dos maiores</Label>
          <Textarea id="nomesMaiores" name="nomesMaiores" value={formData.nomesMaiores} onChange={handleInputChange} placeholder="Digite os nomes separados por vírgula" rows={3} />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="qtdMenores">Quantos menores de idade moram na casa?</Label>
        <Input id="qtdMenores" name="qtdMenores" type="number" min={0} value={formData.qtdMenores} onChange={(e) => setFormData((prev) => ({ ...prev, qtdMenores: parseInt(e.target.value) || 0 }))} />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <Checkbox id="termoAdesao" checked={formData.termoAdesao} onCheckedChange={(c) => handleCheckboxChange("termoAdesao", !!c)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="termoAdesao" className="font-normal text-sm leading-relaxed">
            <span className="text-destructive">*</span> <strong>Termo de Adesão:</strong> Declaro estar ciente do Estatuto Social e me comprometo com os deveres da associação.
          </Label>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Checkbox id="termoLGPD" checked={formData.termoLGPD} onCheckedChange={(c) => handleCheckboxChange("termoLGPD", !!c)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="termoLGPD" className="font-normal text-sm leading-relaxed">
            <span className="text-destructive">*</span> <strong>LGPD:</strong> Concordo com o tratamento dos meus dados para fins cadastrais.
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        A contribuição mensal é de <strong>R$ 15,00</strong>.
      </p>
      <div className="space-y-2">
        <Label>Como prefere contribuir? <span className="text-destructive">*</span></Label>
        <Select value={formData.formaPagamento} onValueChange={(v) => handleSelectChange("formaPagamento", v)}>
          <SelectTrigger><SelectValue placeholder="Selecione a forma de pagamento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Dados Pessoais";
      case 2: return "Onde te encontramos?";
      case 3: return "Quem mora com você?";
      case 4: return "Finalizando...";
      case 5: return "Pagamento";
      default: return "";
    }
  };

  return (
    <section id="associacao" className="px-4 py-6 pb-8">
      <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-accent/5 rounded-2xl p-5 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 flex-shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Associação de Moradores
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Fortaleça nosso bairro. Sua voz faz a diferença. Associe-se!
            </p>
            <Button variant="association" onClick={() => setIsDialogOpen(true)} className="group">
              Quero me associar
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">{getStepTitle()}</DialogTitle>
            <DialogDescription className="text-center">
              Etapa {currentStep} de {TOTAL_STEPS}
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator()}

          <div className="mt-2">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          <div className="flex justify-between gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                Próximo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AssociationCard;
