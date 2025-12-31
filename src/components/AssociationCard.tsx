import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AssociationCard = () => {
  const handleJoin = () => {
    window.open(
      "https://wa.me/5519999999999?text=Olá! Gostaria de me associar à Associação de Moradores do Jardim Embaré.",
      "_blank"
    );
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
              onClick={handleJoin}
              className="group"
            >
              Quero me associar
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssociationCard;
