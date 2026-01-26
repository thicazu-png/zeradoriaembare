import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, MessageCircle, Store, Navigation, Instagram, Globe, Phone } from "lucide-react";
import PartnerAction from "@/components/PartnerAction";

interface Business {
  categoria: string | null | undefined;
  nome: string | null | undefined;
  endereco: string | null | undefined;
  contatos: string | number | null | undefined;
  logo: string | null | undefined;
  lat?: number | null;
  lng?: number | null;
}

// ✅ URL ATUALIZADA (f4qtQ/exec)
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyZXkG0BH2k0ZFwOaZTUBc6lkArdSYxMctyMTxglgYL_8hNnJqX_OC19G6qjTmgyF4qtQ/exec";

const categories = ["TODOS", "ALIMENTAÇÃO", "SERVIÇOS", "BELEZA", "OUTROS"];

const categoryColors: Record<string, string> = {
  "ALIMENTAÇÃO": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "SERVIÇOS": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "BELEZA": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "OUTROS": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const INITIAL_VISIBLE_COUNT = 6;

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${WEBHOOK_URL}?type=comercio&t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Erro ao carregar dados");
        const data = await response.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Não foi possível carregar os comércios.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const parseContacts = (contatos: string | number | null | undefined) => {
    const str = contatos ? String(contatos) : '';
    if (!str.trim()) return [];
    return str.split(';').map(item => {
      const val = item.trim();
      if (val.includes('@')) return { type: 'instagram', value: `https://instagram.com/${val.replace('@','')}`, display: val };
      if (val.includes('http')) return { type: 'website', value: val, display: 'Site' };
      const num = val.replace(/\D/g, '');
      if (num.length >= 10) return { type: 'whatsapp', value: num.startsWith('55') ? num : `55${num}`, display: val };
      return { type: 'phone', value: num, display: val };
    });
  };

  // ✅ Função simplificada: O Script já manda o link certo
  const getImageUrl = (logo: string | null | undefined): string | null => {
    if (!logo || logo.includes("Sem logo") || logo.length < 10) return null;
    return String(logo);
  };

  const getCategoryGroup = (categoria: string | null | undefined): string => {
    const cat = String(categoria || '').toLowerCase();
    if (/restaurante|lanchonete|pizza|marmita|padaria|doce|acai|bebida|mercado/.test(cat)) return "ALIMENTAÇÃO";
    if (/eletricista|encanador|pedreiro|mecanic|frete|limpeza|servico/.test(cat)) return "SERVIÇOS";
    if (/salao|beleza|barber|estetica|unha|cabelo/.test(cat)) return "BELEZA";
    return "OUTROS";
  };

  const filtered = selectedCategory === "TODOS" 
    ? businesses 
    : businesses.filter(b => getCategoryGroup(b.categoria) === selectedCategory);

  return (
    <div className="px-4 py-6">
      <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6">
        <h2 className="text-xl font-bold text-center uppercase text-foreground mb-4 flex items-center justify-center gap-2">
          <Store className="h-5 w-5 text-primary" /> Guia Comercial
        </h2>

        <Tabs defaultValue="TODOS" className="mb-6">
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
                className="text-[10px] sm:text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground italic">Nenhum comércio nesta categoria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.slice(0, visibleCount).map((b, i) => {
              const contacts = parseContacts(b.contatos);
              const img = getImageUrl(b.logo);
              const dirUrl = b.lat ? `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(b.endereco) + " São Carlos SP")}`;

              return (
                <div key={i} className="bg-white/60 border border-white/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/10 mb-3 bg-muted flex items-center justify-center">
                    {img ? (
                      <img src={img} alt="Logo" className="h-full w-full object-cover" onError={(e) => e.currentTarget.src = ""} />
                    ) : <Store className="h-8 w-8 text-muted-foreground" />}
                  </div>
                  
                  <h3 className="font-bold text-sm text-foreground leading-tight mb-1">{b.nome}</h3>
                  <Badge className={`mb-3 text-[10px] ${categoryColors[getCategoryGroup(b.categoria)] || categoryColors.OUTROS}`}>
                    {b.categoria}
                  </Badge>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-4">
                    <MapPin size={12} className="text-primary" />
                    <span className="line-clamp-1">{b.endereco}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-auto">
                    {contacts.map((c, idx) => (
                      <Button 
                        key={idx} 
                        variant={c.type === 'whatsapp' ? 'default' : 'outline'} 
                        size="sm" 
                        className={`h-8 text-[10px] gap-1 ${c.type === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => window.open(c.type === 'whatsapp' ? `https://wa.me/${c.value}` : c.value, '_blank')}
                      >
                        {c.type === 'whatsapp' ? <MessageCircle size={12} /> : c.type === 'instagram' ? <Instagram size={12} /> : <Phone size={12} />}
                        {c.type === 'whatsapp' ? 'Whats' : 'Contato'}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1" onClick={() => window.open(dirUrl, '_blank')}>
                      <Navigation size={12} /> Rota
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > visibleCount && (
          <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => setVisibleCount(v => v + 6)}>
            Carregar mais comércios...
          </Button>
        )}

        <div className="mt-8 pt-6 border-t border-white/20">
          <PartnerAction showAsButton />
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
