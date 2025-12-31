import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 text-primary" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-primary" />
          </a>
        </div>

        {/* Legal Info */}
        <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
          Associação de Moradores do Bairro Jardim Embaré<br />
          CNPJ nº 33.764.618/0001-87
        </p>

        {/* Credits */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
          <span>App criado por Thiago Cazu</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Instagram do criador"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
