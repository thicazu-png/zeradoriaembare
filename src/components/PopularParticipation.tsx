import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, Check, Upload, Users, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import logoSaae from "@/assets/logo-saae.png";
import { supabase } from "@/integrations/supabase/client";

const TOTAL_STEPS = 3;

const initialFormData = {
  // Step 1 - Dados Pessoais
  nome: "",
  documento: "",
  email: "",
  cdcMatricula: "",
  // Step 2 - Consumo e Foto
  mediaConsumo: "",
  consumoValorAtual: "",
  fotoConta: null as File | null,
  // Step 3 - Termos
  termoAssinatura: false,
  termoLGPD: false,
};

const PopularParticipation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [signatureCount, setSignatureCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSignatureCount();
  }, []);

  const fetchSignatureCount = async () => {
    try {
      const { count, error } = await supabase
        .from("petition_signatures")
        .select("*", { count: "exact", head: true });
      
      if (!error && count !== null) {
        setSignatureCount(count);
      }
    } catch (error) {
      console.error("Error fetching signature count:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, fotoConta: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, fotoConta: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.nome.trim() || !formData.documento.trim() || !formData.email.trim() || !formData.cdcMatricula.trim()) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha Nome, RG/CPF, E-mail e CDC/Matrícula.",
            variant: "destructive",
          });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          toast({
            title: "E-mail inválido",
            description: "Digite um e-mail válido.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.mediaConsumo.trim() || !formData.consumoValorAtual.trim()) {
          toast({
            title: "Campos obrigatórios",
            description: "Preencha a Média de Consumo e o Consumo/Valor Atual.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.fotoConta) {
          toast({
            title: "Foto obrigatória",
            description: "Envie a foto da conta abusiva.",
            variant: "destructive",
          });
          return false;
        }
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

  const uploadPhoto = async (): Promise<string | null> => {
    if (!formData.fotoConta) return null;

    const fileExt = formData.fotoConta.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("petition-photos")
      .upload(fileName, formData.fotoConta);

    if (error) {
      console.error("Error uploading photo:", error);
      throw new Error("Erro ao enviar foto");
    }

    const { data: publicUrlData } = supabase.storage
      .from("petition-photos")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Upload photo first
      const photoUrl = await uploadPhoto();

      // Save to Supabase
      const { error } = await supabase.from("petition_signatures").insert({
        nome: formData.nome.trim(),
        documento: formData.documento.trim(),
        email: formData.email.trim(),
        cdc_matricula: formData.cdcMatricula.trim(),
        media_consumo: formData.mediaConsumo.trim(),
        consumo_valor_atual: formData.consumoValorAtual.trim(),
        foto_conta_url: photoUrl,
      });

      if (error) throw error;

      // Also send to Google Sheets
      const payload = {
        source: "abaixo-assinado-saae",
        nome: formData.nome.trim(),
        documento: formData.documento.trim(),
        email: formData.email.trim(),
        cdcMatricula: formData.cdcMatricula.trim(),
        mediaConsumo: formData.mediaConsumo.trim(),
        consumoValorAtual: formData.consumoValorAtual.trim(),
        fotoContaUrl: photoUrl,
        termoAssinatura: formData.termoAssinatura,
        termoLGPD: formData.termoLGPD,
      };

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

      setSignatureCount((prev) => prev + 1);
      removeFile();
      setFormData(initialFormData);
      setCurrentStep(1);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting:", error);
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
      removeFile();
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
          <Label htmlFor="nome">Nome Completo (Legível) <span className="text-destructive">*</span></Label>
          <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Seu nome completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="documento">RG ou CPF <span className="text-destructive">*</span></Label>
          <Input id="documento" name="documento" value={formData.documento} onChange={handleInputChange} placeholder="000.000.000-00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail válido <span className="text-destructive">*</span></Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cdcMatricula">CDC / Matrícula <span className="text-destructive">*</span></Label>
          <Input id="cdcMatricula" name="cdcMatricula" value={formData.cdcMatricula} onChange={handleInputChange} placeholder="Número da matrícula SAAE" />
          <p className="text-xs text-muted-foreground">Indispensável para o SAAE localizar sua conta no sistema.</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Informe os dados de consumo e envie a foto da conta.
      </p>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="mediaConsumo">Média de Consumo (m³) <span className="text-destructive">*</span></Label>
          <Input id="mediaConsumo" name="mediaConsumo" value={formData.mediaConsumo} onChange={handleInputChange} placeholder="Ex: 10 m³" />
          <p className="text-xs text-muted-foreground">Prova que seu consumo era baixo.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="consumoValorAtual">Consumo/Valor Atual <span className="text-destructive">*</span></Label>
          <Input id="consumoValorAtual" name="consumoValorAtual" value={formData.consumoValorAtual} onChange={handleInputChange} placeholder="Ex: 45 m³ / R$ 350,00" />
          <p className="text-xs text-muted-foreground">Prova do aumento súbito.</p>
        </div>
        <div className="space-y-2">
          <Label>Foto da Conta Abusiva <span className="text-destructive">*</span></Label>
          {previewUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Clique para enviar a foto</p>
              <p className="text-xs text-muted-foreground mt-1">Máximo 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
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
      case 2: return "Consumo e Comprovante";
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
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            <span className="block">Sua assinatura fortalece nossa</span>
            <span className="block">cobrança por melhorias no Embaré.</span>
          </p>
          
          {/* Signature Counter */}
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-primary/20">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {signatureCount} {signatureCount === 1 ? "assinatura" : "assinaturas"}
            </span>
          </div>

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
