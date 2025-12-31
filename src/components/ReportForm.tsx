import { useState } from "react";
import { Camera, Send, MapPin, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const occurrenceTypes = [
  { value: "mato-alto", label: "Mato Alto" },
  { value: "buraco", label: "Buraco na Rua" },
  { value: "lixo", label: "Lixo / Entulho" },
  { value: "iluminacao", label: "Iluminação Pública" },
  { value: "outros", label: "Outros" },
];

const ReportForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    address: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Solicitação enviada! ✓",
      description:
        "Sua ocorrência foi registrada com sucesso. Acompanhe pelo seu e-mail.",
    });

    setFormData({
      type: "",
      name: "",
      address: "",
      description: "",
    });
    setIsSubmitting(false);
  };

  return (
    <section id="chamado" className="px-4 py-6">
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Reportar Problema
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo de Ocorrência
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type" className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                {occurrenceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Seu Nome
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-12 pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Endereço / Localização
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Rua, número, referência..."
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-12 pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição do problema
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o problema com detalhes..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Foto do local</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
              <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Toque para adicionar foto
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                JPG, PNG até 5MB
              </p>
            </div>
          </div>

          <Button
            type="submit"
            size="full"
            className="mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-pulse-soft">Enviando...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Solicitação
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ReportForm;
