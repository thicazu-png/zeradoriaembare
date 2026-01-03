import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, MessageCircle, Store, Navigation, Instagram, Globe, Phone, Plus } from "lucide-react";
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

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

const categories = ["TODOS", "ALIMENTAÇÃO", "SERVIÇOS", "BELEZA", "OUTROS"];

const categoryColors: Record<string, string> = {
  "ALIMENTAÇÃO": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "SERVIÇOS": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "BELEZA": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "OUTROS": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const INITIAL_VISIBLE_COUNT = 3;

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`${WEBHOOK_URL}?type=comercio`);
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

  interface ContactItem {
    type: 'whatsapp' | 'phone' | 'instagram' | 'website';
    value: string;
    display: string;
  }

  const parseContacts = (contatos: string | number | null | undefined): ContactItem[] => {
    const contatosStr = contatos ? String(contatos) : '';
    if (!contatosStr.trim()) return [];

    const items = contatosStr.split(';').map(item => item.trim()).filter(Boolean);
    const parsed: ContactItem[] = [];

    for (const item of items) {
      if (item.startsWith('@') || item.toLowerCase().includes('instagram')) {
        const handle = item.replace(/.*@/, '@').replace(/\s/g, '');
        const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
        if (cleanHandle) {
          parsed.push({
            type: 'instagram',
            value: `https://instagram.com/${cleanHandle}`,
            display: `@${cleanHandle}`
          });
        }
        continue;
      }

      if (item.toLowerCase().includes('http') || item.toLowerCase().includes('www.') || item.includes('.com')) {
        let url = item.trim();
        if (!url.startsWith('http')) {
          url = 'https://' + url.replace(/^www\./, '');
        }
        parsed.push({
          type: 'website',
          value: url,
          display: item.replace(/https?:\/\//, '').replace(/^www\./, '').slice(0, 25)
        });
        continue;
      }

      const numbers = item.replace(/\D/g, '');
      if (numbers.length >= 8) {
        if (numbers.length >= 10) {
          const formattedNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
          parsed.push({
            type: 'whatsapp',
            value: formattedNumber,
            display: item.trim()
          });
        } else {
          parsed.push({
            type: 'phone',
            value: numbers,
            display: item.trim()
          });
        }
      }
    }

    return parsed;
  };

  const getImageUrl = (logo: string | null | undefined): string | null => {
    if (!logo) return null;
    const logoStr = String(logo);
    
    if (logoStr.includes('drive.google.com')) {
      const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/
      ];
      
      for (const pattern of patterns) {
        const match = logoStr.match(pattern);
        if (match && match[1]) {
          return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
        }
      }
      return null;
    }
    
    return logoStr;
  };

  const getCategoryGroup = (categoria: string | null | undefined): string => {
    const cat = String(categoria || '').toLowerCase();
    
    const alimentacaoKeywords = [
      "restaurante", "marmitaria", "lanchonete", "hamburgueria", "pizzaria",
      "padaria", "confeitaria", "mercado", "mercearia", "hortifruti", "açougue",
      "acougue", "açaí", "acai", "sorveteria", "adega", "bebidas", "doces",
      "bolos", "buffet", "festas", "café", "cafe", "bar", "pastelaria"
    ];
    if (alimentacaoKeywords.some(keyword => cat.includes(keyword))) {
      return "ALIMENTAÇÃO";
    }
    
    const servicosKeywords = [
      "eletricista", "encanador", "caça vazamento", "pedreiro", "reformas",
      "pintor", "marido de aluguel", "chaveiro", "jardinagem", "paisagismo",
      "refrigeração", "ar condicionado", "fretes", "mudanças", "mudanca",
      "dedetizadora", "limpeza", "mecânica", "mecanica", "mecânico", "mecanico",
      "auto elétrica", "auto eletrica", "funilaria", "lava rápido", "lava rapido",
      "borracharia", "auto peças", "auto pecas", "acessórios", "costura",
      "gás", "gas", "água", "agua", "serviços", "servicos"
    ];
    if (servicosKeywords.some(keyword => cat.includes(keyword))) {
      return "SERVIÇOS";
    }
    
    const belezaKeywords = [
      "salão", "salao", "beleza", "barbearia", "manicure", "pedicure",
      "estética", "estetica", "depilação", "depilacao", "maquiagem", "makeup",
      "sobrancelha", "farmácia", "farmacia", "dentista", "consultório",
      "consultorio", "psicologia", "terapias", "terapia", "pilates", "yoga",
      "personal", "massagem", "cabelo"
    ];
    if (belezaKeywords.some(keyword => cat.includes(keyword))) {
      return "BELEZA";
    }
    
    return "OUTROS";
  };

  const filteredBusinesses = selectedCategory === "TODOS"
    ? businesses
    : businesses.filter(b => getCategoryGroup(b.categoria) === selectedCategory);

  const displayedBusinesses = filteredBusinesses.slice(0, visibleCount);
  const remainingCount = filteredBusinesses.length - visibleCount;
  const isExpanded = visibleCount >= filteredBusinesses.length;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-center uppercase text-foreground mb-4 flex items-center justify-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Guia Comercial
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-destructive/10 border border-destructive/50 rounded-2xl p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-6">
        <h2 className="text-xl font-bold text-center uppercase text-foreground mb-4 flex items-center justify-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Guia Comercial
        </h2>

        <Tabs defaultValue="TODOS" className="mb-4">
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                onClick={() => handleCategoryChange(cat)}
                className="text-xs px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filteredBusinesses.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum comércio nesta categoria ainda.</p>
            <p className="text-sm mt-1">Seja o primeiro a cadastrar!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedBusinesses.map((business, index) => {
                const contacts = parseContacts(business.contatos);
                const categoryGroup = getCategoryGroup(business.categoria);
                const imageUrl = getImageUrl(business.logo);
                const nomeStr = String(business.nome || 'Sem nome');
                const categoriaStr = String(business.categoria || 'Outros');
                const enderecoStr = business.endereco ? String(business.endereco) : null;
                
                const getDirectionsUrl = () => {
                  if (business.lat && business.lng && !isNaN(Number(business.lat)) && !isNaN(Number(business.lng))) {
                    return `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`;
                  }
                  if (enderecoStr) {
                    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoStr + ", Jardim Embaré, São Carlos")}`;
                  }
                  return null;
                };
                
                const directionsUrl = getDirectionsUrl();

                return (
                  <div key={index} className="overflow-hidden hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl">
                    <div className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative h-16 w-16 mb-3">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={nomeStr}
                              className="h-16 w-16 rounded-full object-cover border-2 border-muted"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          )}
                          <div 
                            className="h-16 w-16 rounded-full bg-muted items-center justify-center border-2 border-muted"
                            style={{ display: imageUrl ? 'none' : 'flex' }}
                          >
                            <Store className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                          {nomeStr}
                        </h3>

                        <Badge 
                          variant="secondary" 
                          className={`mb-2 text-xs ${categoryColors[categoryGroup] || categoryColors["OUTROS"]}`}
                        >
                          {categoriaStr}
                        </Badge>

                        {enderecoStr && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoStr + ", Jardim Embaré, São Carlos")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center gap-1 mb-3 hover:underline cursor-pointer transition-colors"
                          >
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-2">{enderecoStr}</span>
                          </a>
                        )}

                        <div className="w-full flex flex-col gap-2">
                          {contacts.filter(c => c.type === 'whatsapp').map((contact, i) => (
                            <Button
                              key={`whatsapp-${i}`}
                              size="sm"
                              className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => window.open(`https://wa.me/${contact.value}`, "_blank")}
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </Button>
                          ))}

                          {contacts.filter(c => c.type === 'phone').map((contact, i) => (
                            <Button
                              key={`phone-${i}`}
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => window.open(`tel:${contact.value}`, "_self")}
                            >
                              <Phone className="h-4 w-4" />
                              Ligar
                            </Button>
                          ))}

                          {contacts.filter(c => c.type === 'instagram').map((contact, i) => (
                            <Button
                              key={`instagram-${i}`}
                              size="sm"
                              variant="outline"
                              className="w-full gap-2 border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-950"
                              onClick={() => window.open(contact.value, "_blank")}
                            >
                              <Instagram className="h-4 w-4" />
                              {contact.display}
                            </Button>
                          ))}

                          {contacts.filter(c => c.type === 'website').map((contact, i) => (
                            <Button
                              key={`website-${i}`}
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => window.open(contact.value, "_blank")}
                            >
                              <Globe className="h-4 w-4" />
                              Site
                            </Button>
                          ))}
                          
                          {directionsUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => window.open(directionsUrl, "_blank")}
                            >
                              <Navigation className="h-4 w-4" />
                              Como Chegar
                            </Button>
                          )}
                          
                          {contacts.length === 0 && !directionsUrl && (
                            <p className="text-xs text-muted-foreground">Informações não disponíveis</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBusinesses.length > INITIAL_VISIBLE_COUNT && (
              <div className="mt-4 flex justify-center">
                {isExpanded ? (
                  <Button
                    variant="ghost"
                    onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Recolher lista
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(filteredBusinesses.length)}
                    className="gap-1"
                  >
                    Ver todos os comércios (+{remainingCount})
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Register Business Button */}
        <div className="mt-6 pt-4 border-t border-white/30">
          <PartnerAction showAsButton />
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
