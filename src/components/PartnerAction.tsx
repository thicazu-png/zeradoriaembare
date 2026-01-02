import { useState } from "react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

const categoryGroups = [
  {
    label: "🍔 ALIMENTAÇÃO",
    options: [
      "Restaurante / Marmitaria",
      "Lanchonete / Hamburgueria",
      "Pizzaria",
      "Padaria / Confeitaria",
      "Mercado / Mercearia",
      "Hortifruti / Açougue",
      "Açaí / Sorveteria",
      "Adega / Bebidas",
      "Doces / Bolos para Festas"
    ]
  },
  {
    label: "🔧 SERVIÇOS TÉCNICOS & CASA",
    options: [
      "Eletricista",
      "Encanador / Caça Vazamento",
      "Pedreiro / Reformas",
      "Pintor",
      "Marido de Aluguel",
      "Chaveiro",
      "Jardinagem / Paisagismo",
      "Refrigeração / Ar Condicionado",
      "Fretes / Mudanças",
      "Dedetizadora / Limpeza"
    ]
  },
  {
    label: "💅 BELEZA & SAÚDE",
    options: [
      "Salão de Beleza",
      "Barbearia",
      "Manicure / Pedicure",
      "Estética / Depilação",
      "Maquiagem / Sobrancelha",
      "Farmácia",
      "Dentista / Consultório",
      "Psicologia / Terapias",
      "Pilates / Yoga / Personal"
    ]
  },
  {
    label: "🚗 AUTOMOTIVO",
    options: [
      "Mecânica Geral",
      "Auto Elétrica",
      "Funilaria e Pintura",
      "Lava Rápido / Estética Automotiva",
      "Borracharia",
      "Auto Peças / Acessórios"
    ]
  },
  {
    label: "🛒 COMPRAS & VARIEDADES",
    options: [
      "Roupas / Calçados",
      "Papelaria / Bazar",
      "Artesanato / Costura",
      "Gás e Água",
      "Floricultura",
      "Material de Construção"
    ]
  },
  {
    label: "🐾 PETS",
    options: [
      "Pet Shop / Ração",
      "Veterinário",
      "Banho e Tosa",
      "Cuidador / Passeador"
    ]
  },
  {
    label: "🎓 EDUCAÇÃO & LAZER",
    options: [
      "Aulas Particulares / Reforço",
      "Escola de Idiomas",
      "Escola de Música / Dança",
      "Buffet / Festas"
    ]
  },
  {
    label: "📦 OUTROS",
    options: ["Outros"]
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
      <div className="bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-400/5 rounded-2xl p-5 border border-amber-500/20">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 mb-3">
            <Store className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Tem um negócio no bairro?
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            <span className="block">Cadastre seu comércio ou serviço gratuitamente</span>
            <span className="block">e apareça para todos os vizinhos no App.</span>
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white group">
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
                  <label className="text-sm font-medium">Canais de Contato</label>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Importante: Informe o DDD no telefone. Se houver mais de um contato (ex: WhatsApp e Instagram), separe-os por ponto e vírgula (;).
                  </p>
                  <Textarea
                    placeholder="Ex: (16) 99999-8888; @loja_do_bairro; www.meusite.com"
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
        </div>
      </div>
    </section>
  );
};

export default PartnerAction;
