import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import logoSaae from "@/assets/logo-saae.png";

const TOTAL_STEPS = 3;

const initialFormData = {
  // Step 1 - Dados Pessoais
  nome: "",
  endereco: "",
  email: "",
  celular: "",
  // Step 2 - Motivo
  motivo: "",
  // Step 3 - Termos
  termoAssinatura: false,
  termoLGPD: false,
};

const PopularParticipation = () => {
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.nome.trim() || !formData.celular.trim()) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha Nome Completo e Celular.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        if (!formData.termoAssinatura || !formData.termoLGPD) {
          toast({
            title: "Termos obrigatórios",
            description: "Você precisa aceitar os termos para assinar.",
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
      source: "abaixo-assinado-saae",
      nome: formData.nome.trim(),
      endereco: formData.endereco.trim(),
      email: formData.email.trim(),
      celular: formData.celular.trim(),
      motivo: formData.motivo.trim(),
      termoAssinatura: formData.termoAssinatura,
      termoLGPD: formData.termoLGPD,
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
        title: "Assinatura registrada!",
        description: "Obrigado por participar do abaixo-assinado.",
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
        Preencha seus dados para assinar o abaixo-assinado.
      </p>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo <span className="text-destructive">*</span></Label>
          <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Seu nome completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} placeholder="Rua, número - bairro" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular">Celular / WhatsApp <span className="text-destructive">*</span></Label>
          <Input id="celular" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="(00) 00000-0000" />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Conte-nos por que você está assinando (opcional).
      </p>
      <div className="space-y-2">
        <Label htmlFor="motivo">Seu relato ou motivação</Label>
        <Textarea 
          id="motivo" 
          name="motivo" 
          value={formData.motivo} 
          onChange={handleInputChange} 
          placeholder="Descreva sua experiência ou motivo para assinar este abaixo-assinado..."
          rows={5}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <Checkbox id="termoAssinatura" checked={formData.termoAssinatura} onCheckedChange={(c) => handleCheckboxChange("termoAssinatura", !!c)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="termoAssinatura" className="font-normal text-sm leading-relaxed">
            <span className="text-destructive">*</span> <strong>Declaro:</strong> Manifesto minha insatisfação com as práticas abusivas do SAAE e apoio a cobrança por melhorias no atendimento à comunidade do Jardim Embaré.
          </Label>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Checkbox id="termoLGPD" checked={formData.termoLGPD} onCheckedChange={(c) => handleCheckboxChange("termoLGPD", !!c)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="termoLGPD" className="font-normal text-sm leading-relaxed">
            <span className="text-destructive">*</span> <strong>LGPD:</strong> Concordo com o tratamento dos meus dados para fins deste abaixo-assinado.{" "}
            <PrivacyPolicyModal
              trigger={
                <span className="text-primary underline text-xs hover:text-primary/80 transition-colors cursor-pointer">
                  (Ler Política)
                </span>
              }
            />
          </Label>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Seus Dados";
      case 2: return "Seu Relato";
      case 3: return "Confirmar Assinatura";
      default: return "";
    }
  };

  return (
    <section id="participacao" className="px-4 py-6">
      <h2 className="text-center text-sm font-bold uppercase text-slate-700 mb-4">
        Participação Popular
      </h2>
      
      <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-accent/5 rounded-2xl p-5 border border-primary/20">
        <div className="flex flex-col items-center text-center">
          <img 
            src={logoSaae} 
            alt="SAAE" 
            className="h-14 w-auto object-contain mb-3"
          />
          <h3 className="text-lg font-bold text-foreground mb-1">
            Abaixo-Assinado Contra Abuso SAAE
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            <span className="block">Sua assinatura fortalece nossa</span>
            <span className="block">cobrança por melhorias no Embaré.</span>
          </p>
          <Button variant="association" onClick={() => setIsDialogOpen(true)} className="group">
            ✍️ Assinar Abaixo-Assinado
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
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
                {isSubmitting ? "Enviando..." : "Confirmar Assinatura"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PopularParticipation;
