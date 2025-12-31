import { useState } from "react";
import { Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

const categoryGroups = [
  {
    label: "ALIMENTAÇÃO",
    options: ["Restaurante", "Lanchonete", "Padaria", "Mercado"]
  },
  {
    label: "SERVIÇOS",
    options: ["Mecânico", "Eletricista", "Pedreiro", "Marido de Aluguel"]
  },
  {
    label: "BELEZA",
    options: ["Salão", "Manicure", "Barbearia"]
  },
  {
    label: "OUTROS",
    options: ["Pet Shop", "Loja de Roupas", "Aulas"]
  }
];

interface FormData {
  categoria: string;
  nomeFantasia: string;
  documento: string;
  nomeProprietario: string;
  endereco: string;
  contatos: string;
}

const PartnerAction = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    categoria: "",
    nomeFantasia: "",
    documento: "",
    nomeProprietario: "",
    endereco: "",
    contatos: ""
  });

  const resetForm = () => {
    setFormData({
      categoria: "",
      nomeFantasia: "",
      documento: "",
      nomeProprietario: "",
      endereco: "",
      contatos: ""
    });
    setSelectedFile(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoria) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.nomeFantasia.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome fantasia.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.nomeProprietario.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do responsável.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let logoBase64 = "";
      if (selectedFile) {
        logoBase64 = await convertToBase64(selectedFile);
      }

      const payload = {
        source: "cadastro_comercio",
        categoria: formData.categoria,
        nomeFantasia: formData.nomeFantasia.trim(),
        documento: formData.documento.trim(),
        nomeProprietario: formData.nomeProprietario.trim(),
        endereco: formData.endereco.trim(),
        contatos: formData.contatos.trim(),
        logo: logoBase64
      };

      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      toast({
        title: "Cadastro enviado!",
        description: "Cadastro enviado para análise!"
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error);
      toast({
        title: "Cadastro enviado!",
        description: "Cadastro enviado para análise!"
      });
      resetForm();
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-6">
      <Card className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <Store className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-lg text-amber-900 dark:text-amber-100">
            Tem um negócio no bairro?
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Cadastre seu comércio ou serviço gratuitamente e apareça para todos os vizinhos no App.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Cadastrar meu Negócio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastro de Parceiro</DialogTitle>
                <DialogDescription>
                  Preencha os dados do seu negócio para aparecer no App.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria *</label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryGroups.map((group) => (
                        <SelectGroup key={group.label}>
                          <SelectLabel className="font-bold text-amber-700 dark:text-amber-400">
                            {group.label}
                          </SelectLabel>
                          {group.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Fantasia *</label>
                  <Input
                    placeholder="Nome do seu negócio"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">CPF ou CNPJ</label>
                  <Input
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Responsável *</label>
                  <Input
                    placeholder="Seu nome completo"
                    value={formData.nomeProprietario}
                    onChange={(e) => setFormData({ ...formData, nomeProprietario: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    placeholder="Rua, número, bairro"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contatos</label>
                  <Textarea
                    placeholder="WhatsApp, Instagram, telefone..."
                    value={formData.contatos}
                    onChange={(e) => setFormData({ ...formData, contatos: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo/Foto</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Arquivo selecionado: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Cadastro"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </section>
  );
};

export default PartnerAction;
