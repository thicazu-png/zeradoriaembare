import { ShoppingBag, Coffee, Users, HardHat, PawPrint, ShieldCheck, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CommunityGroupCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
}

const CommunityGroupCard = ({ icon: Icon, title, subtitle, href }: CommunityGroupCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[#25D366]/30",
        "bg-card shadow-card hover:shadow-elevated transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-[#25D366] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2",
        "no-underline min-h-[120px]"
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366]/10 mb-2">
        <Icon className="w-6 h-6 text-[#25D366]" />
      </div>
      <span className="text-sm font-semibold text-foreground text-center leading-tight">
        {title}
      </span>
      <span className="text-xs text-muted-foreground mt-1 text-center">
        {subtitle}
      </span>
    </a>
  );
};

const CommunityGroups = () => {
  const groups = [
    {
      icon: ShoppingBag,
      title: "Troca e Venda",
      subtitle: "Comércio Local",
      href: "https://chat.whatsapp.com/Edr6N6wrZAf2PDCf0883MZ",
    },
    {
      icon: Coffee,
      title: "Bate Papo",
      subtitle: "Descontração e Amigos",
      href: "https://chat.whatsapp.com/HnIX4k6UVSq4bC00wjp4uu",
    },
    {
      icon: Users,
      title: "Embaré Moradores",
      subtitle: "Assuntos Gerais",
      href: "https://chat.whatsapp.com/BvlJ0n4BOpl1aGqqkB5Uiz",
    },
    {
      icon: HardHat,
      title: "Infraestrutura",
      subtitle: "Manutenção do Bairro",
      href: "https://chat.whatsapp.com/CYF5appVCUC6RvACCkoRaa",
    },
    {
      icon: PawPrint,
      title: "Pets Embaré",
      subtitle: "Animais Perdidos e Adoção",
      href: "https://chat.whatsapp.com/L1CPhWEWULo6MkQoZZaHzF",
    },
    {
      icon: ShieldCheck,
      title: "Segurança (PVS)",
      subtitle: "Falar com André Vigilante",
      href: "https://wa.me/5516992611377?text=Ola,gostaria+de+falar+sobre+a+PVS",
    },
    {
      icon: Newspaper,
      title: "Classificados",
      subtitle: "Falar com Márcio Rogério",
      href: "https://wa.me/5516981198902?text=Ola,gostaria+de+saber+sobre+os+classificados",
    },
  ];

  return (
    <section className="px-4 py-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Outros Grupos do Bairro
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {groups.map((group, index) => (
          <div
            key={group.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CommunityGroupCard {...group} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunityGroups;
