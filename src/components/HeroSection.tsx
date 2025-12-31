import { Sun } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 border border-primary/10">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 flex-shrink-0">
            <Sun className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Olá, vizinho!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O que precisamos resolver hoje?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
