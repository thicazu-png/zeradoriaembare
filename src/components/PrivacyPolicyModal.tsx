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
          <DialogTitle>Política de Privacidade de Dados</DialogTitle>
          <DialogDescription>
            AMBJE - Associação de Moradores do Bairro Jardim Embaré
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 max-h-[60vh]">
          <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pb-4">
            <p className="text-xs text-muted-foreground/70">
              <strong>Última atualização:</strong> 31 de dezembro de 2025
            </p>
            
            <p>
              A <strong>ASSOCIAÇÃO DE MORADORES DO BAIRRO JARDIM EMBARÉ – AMBJE</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>33.764.618/0001-87</strong>, reafirma seu compromisso com a segurança, privacidade e transparência no tratamento das informações de seus moradores e associados.
            </p>
            
            <p>
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais ao utilizar o aplicativo <strong>"Zeladoria Jd. Embaré"</strong> (zeladoriaembare.com).
            </p>

            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Quais dados coletamos?</h4>
              <p className="mb-2">Para viabilizar os serviços de zeladoria e a gestão associativa, coletamos as seguintes categorias de dados:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Para Relato de Problemas (Zeladoria):</strong> Nome completo, endereço da ocorrência, descrição do problema e imagens (fotos) enviadas voluntariamente.</li>
                <li>
                  <strong>Para Associação (Cadastro de Sócio):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><strong>Dados Pessoais:</strong> Nome completo, RG, Órgão Expedidor, Data de Nascimento, Naturalidade, Nacionalidade, Estado Civil e Profissão.</li>
                    <li><strong>Dados de Contato:</strong> Endereço completo, e-mail, telefone residencial e celular/WhatsApp.</li>
                    <li><strong>Dados Familiares:</strong> Informação sobre residência de maiores de idade e quantidade de menores no domicílio.</li>
                    <li><strong>Dados de Pagamento:</strong> Informações relacionadas à escolha do método de contribuição.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Para que usamos seus dados?</h4>
              <p className="mb-2">O tratamento dos dados tem as seguintes finalidades específicas:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Gestão Administrativa:</strong> Formalizar sua adesão à AMBJE e manter o livro de associados atualizado.</li>
                <li><strong>Zeladoria Municipal:</strong> Encaminhar demandas de infraestrutura (buracos, iluminação, limpeza) aos órgãos competentes da Prefeitura Municipal.</li>
                <li><strong>Comunicação:</strong> Enviar comunicados importantes, convocações para assembleias e atualizações sobre o bairro.</li>
                <li><strong>Segurança:</strong> Validar a residência no bairro para acesso aos grupos de segurança comunitária.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Compartilhamento de Dados</h4>
              <p className="mb-2">A AMBJE preza pela confidencialidade. Seus dados <strong>não</strong> serão vendidos. O compartilhamento ocorre apenas nas seguintes situações estritas:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Prefeitura Municipal e Órgãos Públicos:</strong> Compartilhamos apenas os dados estritamente necessários (como endereço e relato) para a resolução de problemas de infraestrutura junto à Prefeitura, SAAE, CPFL ou Polícia.</li>
                <li>
                  <strong>Operadores de Tecnologia:</strong> Utilizamos serviços de terceiros confiáveis para o funcionamento do app, que atuam como operadores de dados sob sigilo:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><strong>Google:</strong> Armazenamento seguro de banco de dados e arquivos.</li>
                    <li><strong>Meta (WhatsApp):</strong> Integração de canais de comunicação.</li>
                    <li><strong>Vercel/Lovable:</strong> Hospedagem da plataforma digital.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Armazenamento e Segurança</h4>
              <p>Os dados são armazenados em servidores seguros em nuvem, protegidos por criptografia e medidas técnicas adequadas para evitar acessos não autorizados, conforme exigido pela Lei Geral de Proteção de Dados (LGPD).</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Seus Direitos</h4>
              <p>Você tem o direito de solicitar à AMBJE, a qualquer momento, o acesso aos seus dados, a correção de informações incompletas ou a exclusão de seu cadastro (ressalvadas as obrigações legais).</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">6. Contato</h4>
              <p>Para dúvidas sobre esta política, entre em contato diretamente com a diretoria da AMBJE através dos canais oficiais no aplicativo.</p>
            </div>
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
