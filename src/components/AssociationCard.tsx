import { useState } from "react";
import { Users, ArrowRight } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const AssociationCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    email: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.telefone.trim() || !formData.endereco.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, telefone e endereço.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      source: "associacao",
      nome: formData.nome.trim(),
      telefone: formData.telefone.trim(),
      endereco: formData.endereco.trim(),
      email: formData.email.trim(),
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
        description: "Bem-vindo à Associação.",
      });

      setFormData({ nome: "", telefone: "", endereco: "", email: "" });
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
            <Button
              variant="association"
              onClick={() => setIsDialogOpen(true)}
              className="group"
            >
              Quero me associar
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Associe-se ao bairro</DialogTitle>
            <DialogDescription>
              Preencha seus dados para fazer parte da Associação de Moradores.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">
                Telefone / WhatsApp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telefone"
                name="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">
                Endereço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Rua, número, bairro"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Confirmar Cadastro"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AssociationCard;
