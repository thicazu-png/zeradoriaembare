import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const PopularParticipation = () => {
  // O "return null" faz com que o componente não renderize nada na tela.
  // Quando quiser que a seção volte, basta apagar a linha abaixo e remover os comentários do código original.
  return null;

  /* O CÓDIGO ABAIXO ESTÁ ARQUIVADO E NÃO SERÁ EXECUTADO:

  const navigate = useNavigate();
  // ... (Se houver estados como isDialogOpen, eles precisam estar aqui dentro se você reativar o código)

  return (
    <section id="participacao" className="px-4 py-6">
      <h2 className="text-center text-sm font-bold uppercase text-slate-700 mb-4">
        Participação Popular
      </h2>
      
      <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-accent/5 rounded-2xl p-5 border border-primary/20">
        <div className="flex flex-col items-center text-center">
          <img 
            src="/logo-saae.png" 
            alt="SAAE" 
            className="h-14 w-auto object-contain mb-3"
          />
          <h3 className="text-lg font-bold text-foreground mb-1">
            Solicitação de Revisão de Conta de Água – AMBJE
          </h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            <span className="block">A AMBJE encaminhará a conta ao SAAE</span>
            <span className="block">para revisão, não sendo necessário o</span>
            <span className="block">seu deslocamento até a autarquia.</span>
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Button 
              variant="default" 
              onClick={() => window.open("https://script.google.com/macros/s/AKfycbzWs-xvHlJSHvbEO61IUazYm-NhJz_jkLedG0AxPNsxq_c7fop27LCTsC4wGWYkp7sz/exec", "_blank")} 
              className="group w-full"
            >
              ✍️ Solicite Aqui!
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/calculadora-agua")} className="group w-full bg-background/80">
              <Calculator className="w-4 h-4" />
              <span className="flex-1 text-center">Faça seu Cálculo</span>
              <ArrowRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
  */
};

export default PopularParticipation;