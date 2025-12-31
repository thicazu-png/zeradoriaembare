import { ReactNode } from "react";
import { Smartphone, Apple, Chrome } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstallGuideModalProps {
  trigger: ReactNode;
}

const InstallGuideModal = ({ trigger }: InstallGuideModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Instalação do App
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 max-h-[60vh]">
          <div className="text-sm text-muted-foreground leading-relaxed space-y-6 pb-6">
            {/* Android Instructions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#34A853]/10">
                  <Chrome className="w-4 h-4 text-[#34A853]" />
                </div>
                <h3 className="font-semibold text-foreground">Android (Chrome)</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Abra o site no <strong>Chrome</strong></li>
                <li>Toque nos <strong>3 pontinhos</strong> (⋮) no canto superior direito</li>
                <li>Selecione <strong>"Adicionar à Tela Inicial"</strong></li>
                <li>Confirme tocando em <strong>"Adicionar"</strong></li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                  <Apple className="w-4 h-4 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">iPhone / iPad (Safari)</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Abra o site no <strong>Safari</strong></li>
                <li>Toque no ícone <strong>Compartilhar</strong> (quadrado com seta para cima)</li>
                <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong></li>
                <li>Confirme tocando em <strong>"Adicionar"</strong></li>
              </ol>
            </div>

            <p className="text-xs text-muted-foreground/70 text-center pt-2 border-t border-border">
              Após instalar, o app aparecerá na sua tela inicial como um aplicativo normal.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InstallGuideModal;
