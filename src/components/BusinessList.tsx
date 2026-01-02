import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, MessageCircle, Store } from "lucide-react";

interface Business {
  categoria: string;
  nome: string;
  endereco: string;
  contatos: string;
  logo: string;
}

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

const categories = ["TODOS", "ALIMENTAÇÃO", "SERVIÇOS", "BELEZA", "OUTROS"];

const categoryColors: Record<string, string> = {
  "ALIMENTAÇÃO": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "SERVIÇOS": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "BELEZA": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "OUTROS": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(WEBHOOK_URL);
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

  const extractWhatsAppNumber = (contatos: string | number | null | undefined): string | null => {
    const phoneStr = contatos ? String(contatos) : '';
    const numbers = phoneStr.replace(/\D/g, "");
    if (numbers.length >= 10) {
      return numbers.startsWith("55") ? numbers : `55${numbers}`;
    }
    return null;
  };

  const getCategoryGroup = (categoria: string): string => {
    const cat = categoria.toUpperCase();
    if (["RESTAURANTE", "LANCHONETE", "PADARIA", "MERCADO"].some(c => cat.includes(c))) {
      return "ALIMENTAÇÃO";
    }
    if (["MECÂNICO", "ELETRICISTA", "PEDREIRO", "MARIDO DE ALUGUEL"].some(c => cat.includes(c))) {
      return "SERVIÇOS";
    }
    if (["SALÃO", "MANICURE", "BARBEARIA"].some(c => cat.includes(c))) {
      return "BELEZA";
    }
    return "OUTROS";
  };

  const filteredBusinesses = selectedCategory === "TODOS"
    ? businesses
    : businesses.filter(b => getCategoryGroup(b.categoria) === selectedCategory);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Comércios do Bairro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4 text-center text-destructive">
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Store className="h-5 w-5 text-primary" />
        Comércios do Bairro
      </h2>

      <Tabs defaultValue="TODOS" className="mb-4">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              onClick={() => setSelectedCategory(cat)}
              className="text-xs px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredBusinesses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum comércio nesta categoria ainda.</p>
            <p className="text-sm mt-1">Seja o primeiro a cadastrar!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((business, index) => {
            const whatsappNumber = extractWhatsAppNumber(business.contatos);
            const categoryGroup = getCategoryGroup(business.categoria);

            return (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.nome}
                        className="h-16 w-16 rounded-full object-cover mb-3 border-2 border-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3 ${business.logo ? 'hidden' : ''}`}>
                      <Store className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {business.nome}
                    </h3>

                    <Badge 
                      variant="secondary" 
                      className={`mb-2 text-xs ${categoryColors[categoryGroup] || categoryColors["OUTROS"]}`}
                    >
                      {business.categoria}
                    </Badge>

                    {business.endereco && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-2">{business.endereco}</span>
                      </p>
                    )}

                    {whatsappNumber ? (
                      <Button
                        size="sm"
                        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Entrar em Contato
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Contato não disponível</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusinessList;
