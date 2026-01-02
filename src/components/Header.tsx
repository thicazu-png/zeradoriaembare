import { useState } from "react";
import { Menu, Home, Zap, Megaphone, Store, UserPlus, Users, Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoAmbje from "@/assets/logo-ambje.png";
import InstallGuideModal from "./InstallGuideModal";

const menuItems = [
  { label: "Início", target: "#inicio", icon: Home },
  { label: "Serviços Essenciais", target: "#servicos", icon: Zap },
  { label: "Reportar Problema", target: "#reportar", icon: Megaphone },
  { label: "Guia Comercial", target: "#guia-comercial", icon: Store },
  { label: "Seja Sócio", target: "#associacao", icon: UserPlus },
  { label: "Grupos do Bairro", target: "#grupos", icon: Users },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (target: string) => {
    setOpen(false);
    setTimeout(() => {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <img 
            src={logoAmbje} 
            alt="AMBJE Logo" 
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Jardim Embaré
            </h1>
            <p className="text-xs text-muted-foreground">Central de Zeladoria</p>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <img src={logoAmbje} alt="AMBJE" className="w-5 h-5 rounded" />
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className="flex items-center gap-3 w-full px-4 py-4 rounded-lg text-foreground hover:bg-secondary transition-colors text-left text-base font-medium"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Install Guide Link */}
            <div className="mt-4 px-4">
              <InstallGuideModal
                trigger={
                  <button className="flex items-center gap-3 w-full px-4 py-4 rounded-lg text-foreground hover:bg-secondary transition-colors text-left text-base font-medium">
                    📲 Como instalar o App
                  </button>
                }
              />
            </div>
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center mb-3">Siga-nos</p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://www.facebook.com/groups/BairroJardimEmbare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/jardimembaresc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:bairrojardimembaresc@gmail.com"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
