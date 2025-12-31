import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PrivacyPolicyModal = ({ trigger, open, onOpenChange }: PrivacyPolicyModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <span onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      )}
      <DialogContent className="max-w-md max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Política de Privacidade</DialogTitle>
          <DialogDescription>
            Associação de Moradores do Bairro Jardim Embaré
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 max-h-[60vh]">
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pb-4">
            <p>
              <strong>1. Introdução</strong><br />
              A Associação de Moradores do Bairro Jardim Embaré (AMBJE), inscrita no CNPJ nº 33.764.618/0001-87, 
              está comprometida com a proteção da privacidade e dos dados pessoais de seus associados e usuários 
              deste aplicativo, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            
            <p>
              <strong>2. Dados Coletados</strong><br />
              Coletamos apenas os dados necessários para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cadastro de associados (nome, RG, data de nascimento, endereço, contatos)</li>
              <li>Registro de chamados e ocorrências no bairro</li>
              <li>Comunicação sobre atividades da associação</li>
            </ul>
            
            <p>
              <strong>3. Uso dos Dados</strong><br />
              Os dados coletados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestão do cadastro de associados</li>
              <li>Encaminhamento de ocorrências aos órgãos competentes</li>
              <li>Comunicação de reuniões, eventos e informações relevantes do bairro</li>
              <li>Controle financeiro das contribuições</li>
            </ul>
            
            <p>
              <strong>4. Compartilhamento</strong><br />
              Seus dados podem ser compartilhados apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Órgãos públicos municipais (Prefeitura, GCM, SAAE) para resolução de ocorrências</li>
              <li>Polícia Militar do Estado de São Paulo, quando aplicável</li>
              <li>Concessionárias de serviços públicos (CPFL) para reparos</li>
            </ul>
            
            <p>
              <strong>5. Armazenamento e Segurança</strong><br />
              Os dados são armazenados em plataformas seguras e protegidos por medidas técnicas adequadas. 
              O acesso é restrito aos membros da diretoria da associação.
            </p>
            
            <p>
              <strong>6. Seus Direitos</strong><br />
              Você tem direito a:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            
            <p>
              <strong>7. Contato</strong><br />
              Para exercer seus direitos ou esclarecer dúvidas, entre em contato pelo e-mail: 
              bairrojardimembaresc@gmail.com
            </p>
            
            <p className="text-xs text-muted-foreground/70">
              Última atualização: Dezembro de 2024
            </p>
          </div>
        </ScrollArea>
        <div className="px-6 pb-6 pt-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsOpen(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
