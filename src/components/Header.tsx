import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import portalEmbare from "@/assets/portal_embare.jpg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <img 
            src={portalEmbare} 
            alt="Portal Jardim Embaré" 
            className="w-12 h-12 rounded-xl object-cover shadow-sm"
          />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Jardim Embaré
            </h1>
            <p className="text-xs text-muted-foreground">Central de Zeladoria</p>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              <a
                href="#"
                className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Início
              </a>
              <a
                href="#servicos"
                className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Serviços Essenciais
              </a>
              <a
                href="#chamado"
                className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Reportar Problema
              </a>
              <a
                href="#associacao"
                className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Associação
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
