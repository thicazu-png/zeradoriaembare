import { Facebook, Instagram, Mail } from "lucide-react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <a
            href="https://www.facebook.com/groups/BairroJardimEmbare"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 text-primary" />
          </a>
          <a
            href="https://www.instagram.com/jardimembaresc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-primary" />
          </a>
          <a
            href="mailto:bairrojardimembaresc@gmail.com"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="E-mail"
          >
            <Mail className="w-5 h-5 text-primary" />
          </a>
        </div>

        {/* Legal Info */}
        <p className="text-xs text-muted-foreground text-center mb-2 leading-relaxed">
          Associação de Moradores do Bairro Jardim Embaré<br />
          CNPJ nº 33.764.618/0001-87
        </p>

        {/* Privacy Policy Link */}
        <div className="flex justify-center mb-4">
          <PrivacyPolicyModal
            trigger={
              <span className="text-xs text-muted-foreground underline hover:text-primary transition-colors">
                Política de Privacidade
              </span>
            }
          />
        </div>

        {/* Developer Credit & Version */}
        <div className="relative flex items-center justify-center py-2">
          {/* Developer Credit - Centered */}
          <a
            href="https://instagram.com/drthiagocazu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-4 py-1.5 text-[11px] text-slate-600 shadow-sm flex items-center gap-2 hover:text-purple-600 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            App desenvolvido por Thiago Cazu
          </a>

          {/* Version Badge - Right */}
          <span className="absolute right-0 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-3 py-1 text-[10px] text-slate-600 shadow-sm">
            v2026.01.07
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
