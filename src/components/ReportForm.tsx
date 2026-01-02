import { useState, useRef } from "react";
import { Camera, Send, User, FileText, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import LocationPicker from "./LocationPicker";

const occurrenceTypes = [
  { value: "buraco", label: "Buraco" },
  { value: "iluminacao", label: "Iluminação" },
  { value: "lixo-limpeza", label: "Lixo/Limpeza" },
  { value: "perturbacao-sossego", label: "Perturbação do sossego" },
  { value: "outros", label: "Outros" },
];

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

const ReportForm = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDifferentLocation, setIsDifferentLocation] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    userAddress: "",
    problemLocation: "",
    description: "",
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resizeAndCompressImage = (file: File, maxSize: number = 1024, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Resize if larger than maxSize
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setFormData({
      type: "",
      name: "",
      userAddress: "",
      problemLocation: "",
      description: "",
      lat: undefined,
      lng: undefined,
    });
    setSelectedFile(null);
    setIsDifferentLocation(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!formData.type) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o tipo de ocorrência.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.userAddress.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu endereço.",
        variant: "destructive",
      });
      return;
    }
    if (isDifferentLocation && !formData.problemLocation.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o endereço da ocorrência.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva o problema.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fotoBase64 = "";
      if (selectedFile) {
        fotoBase64 = await resizeAndCompressImage(selectedFile, 1024, 0.7);
      }

      const payload = {
        source: "site",
        nome: formData.name,
        categoria: formData.type,
        endereco: formData.userAddress,
        local_problema: isDifferentLocation ? formData.problemLocation : "-",
        descricao: formData.description,
        foto: fotoBase64,
        lat: formData.lat,
        lng: formData.lng,
      };

      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast({
        title: "Solicitação enviada! ✓",
        description:
          "Sua ocorrência foi registrada com sucesso. Acompanhe pelo seu e-mail.",
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLocationChange = (location: string, lat?: number, lng?: number) => {
    setFormData({ ...formData, problemLocation: location, lat, lng });
  };

  return (
    <section id="chamado" className="px-4 py-6">
      <div className="bg-white/30 backdrop-blur-lg border border-white/50 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground uppercase text-center">
            Reportar Problema
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5 text-center">
          Preencha os dados abaixo. Seu relato será encaminhado diretamente à secretaria municipal responsável para agilizar a solução.
        </p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="full" className="gap-2">
              📝 Abrir Formulário de Ocorrência
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">Relatar Problema</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Tipo de Ocorrência <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  required
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
                  Seu Nome <span className="text-destructive">*</span>
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
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userAddress" className="text-sm font-medium">
                  Seu Endereço <span className="text-destructive">*</span>
                </Label>
                <LocationPicker
                  value={formData.userAddress}
                  onChange={(location, lat, lng) => {
                    setFormData({ 
                      ...formData, 
                      userAddress: location,
                      lat: isDifferentLocation ? formData.lat : lat,
                      lng: isDifferentLocation ? formData.lng : lng,
                    });
                  }}
                  required
                  placeholder="Rua e número onde você mora"
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="differentLocation"
                  checked={isDifferentLocation}
                  onCheckedChange={(checked) => {
                    setIsDifferentLocation(checked === true);
                    if (!checked) {
                      setFormData({ ...formData, problemLocation: "" });
                    }
                  }}
                />
                <Label 
                  htmlFor="differentLocation" 
                  className="text-sm font-medium cursor-pointer"
                >
                  O problema é em outro local?
                </Label>
              </div>

              {isDifferentLocation && (
                <div className="space-y-2">
                  <Label htmlFor="problemLocation" className="text-sm font-medium">
                    Endereço da Ocorrência <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="problemLocation"
                    placeholder="Ex: Rua X, em frente ao número 123..."
                    value={formData.problemLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, problemLocation: e.target.value })
                    }
                    className="h-12 rounded-xl"
                    required={isDifferentLocation}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descrição do problema <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o problema com detalhes..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px] rounded-xl resize-none"
                  required
                />
              </div>

              <p className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> Campos obrigatórios
              </p>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Foto do local</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="border border-border rounded-xl p-3 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Camera className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">{selectedFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={handleRemoveFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Toque para adicionar foto
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      JPG, PNG até 5MB
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="full"
                className="mt-2 bg-white/60 backdrop-blur-sm border border-white/50 text-foreground hover:bg-white/80"
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
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ReportForm;
