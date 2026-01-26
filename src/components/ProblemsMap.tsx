import { useState, useEffect } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, AlertTriangle, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Problem {
  categoria: string;
  endereco: string;
  descricao: string;
  data?: string;
  foto?: string;
  lat?: number;
  lng?: number;
}

// ✅ URL ATUALIZADA
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyZXkG0BH2k0ZFwOaZTUBc6lkArdSYxMctyMTxglgYL_8hNnJqX_OC19G6qjTmgyF4qtQ/exec";

const MAP_CENTER: [number, number] = [-21.966260500240534, -47.93432760869767];
const DEFAULT_ZOOM = 14;

const CATEGORY_FILTERS = [
  { value: "todos", label: "Todas as Categorias", color: "#000" },
  { value: "buraco", label: "🕳️ Buraco", color: "#ef4444" },
  { value: "iluminacao", label: "💡 Iluminação", color: "#eab308" },
  { value: "lixo", label: "🗑️ Lixo/Limpeza", color: "#22c55e" },
  { value: "perturbacao", label: "🔊 Perturbação", color: "#a855f7" },
  { value: "outros", label: "📍 Outros", color: "#64748b" },
];

/**
 * Função para converter link do Drive em Miniatura estável
 */
const getMapImageUrl = (url: string | undefined) => {
  if (!url || url.includes("Sem foto") || url.length < 10) return null;
  
  // Extrai o ID do arquivo (suporta links /d/ ou id=)
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const fileId = match ? match[1] : null;

  if (fileId) {
    // Endpoint de miniatura: mais rápido e sem bloqueios de redirecionamento
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return url;
};

const getCategoryColor = (categoria: string): string => {
  const cat = categoria?.toLowerCase() || "";
  if (cat.includes("buraco")) return "#ef4444";
  if (cat.includes("iluminação") || cat.includes("iluminacao")) return "#eab308";
  if (cat.includes("lixo") || cat.includes("limpeza")) return "#22c55e";
  if (cat.includes("perturbação") || cat.includes("perturbacao")) return "#a855f7";
  return "#64748b";
};

const getCategoryEmoji = (categoria: string): string => {
  const cat = categoria?.toLowerCase() || "";
  if (cat.includes("buraco")) return "🕳️";
  if (cat.includes("iluminação") || cat.includes("iluminacao")) return "💡";
  if (cat.includes("lixo") || cat.includes("limpeza")) return "🗑️";
  if (cat.includes("perturbação") || cat.includes("perturbacao")) return "🔊";
  return "📍";
};

const ProblemsMap = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("todos");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${WEBHOOK_URL}?type=denuncias&t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Erro ao carregar dados");
        const data = await response.json();
        const validProblems = (Array.isArray(data) ? data : []).filter(
          (p: Problem) => p.lat && p.lng && !isNaN(Number(p.lat)) && !isNaN(Number(p.lng))
        );
        setProblems(validProblems);
      } catch (err) {
        setError("Não foi possível carregar as ocorrências.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-center uppercase mb-4 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Carregando Mapa...
            </h2>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-center uppercase text-foreground mb-2 flex items-center justify-center gap-2">
            🗺️ Mapa da Transparência
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Toque nos ícones para ver detalhes e fotos
          </p>

          <div className="mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    <span className="flex items-center gap-2">{filter.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg overflow-hidden border border-border relative">
            <Map
              height={400}
              defaultCenter={MAP_CENTER}
              defaultZoom={DEFAULT_ZOOM}
              onClick={() => setSelectedProblem(null)}
            >
              {problems
                .filter((p) => selectedCategory === "todos" || p.categoria.toLowerCase().includes(selectedCategory))
                .map((problem, index) => (
                  <Marker
                    key={index}
                    width={35}
                    anchor={[Number(problem.lat), Number(problem.lng)]}
                    color={getCategoryColor(problem.categoria)}
                    onClick={() => setSelectedProblem(problem)}
                  />
                ))}

              {selectedProblem && (
                <Overlay anchor={[Number(selectedProblem.lat), Number(selectedProblem.lng)]} offset={[110, 140]}>
                  <Card className="w-72 shadow-2xl border-primary/30 animate-in fade-in zoom-in duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryEmoji(selectedProblem.categoria)}</span>
                          <span className="font-bold text-sm text-primary uppercase">
                            {selectedProblem.categoria}
                          </span>
                        </div>
                        <button onClick={() => setSelectedProblem(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                      </div>
                      
                      <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
                         📅 {selectedProblem.data}
                      </p>
                      
                      <div className="bg-secondary/50 p-2 rounded mb-2">
                        <p className="text-xs font-semibold flex items-start gap-1">
                          📍 <span className="text-foreground">{selectedProblem.endereco}</span>
                        </p>
                      </div>

                      <p className="text-xs italic mb-3 text-foreground/80">"{selectedProblem.descricao}"</p>
                      
                      {selectedProblem.foto && selectedProblem.foto.length > 10 ? (
                        <div className="relative group">
                          <img
                            src={getMapImageUrl(selectedProblem.foto) || ""}
                            alt="Evidência"
                            referrerPolicy="no-referrer"
                            className="w-full h-32 object-cover rounded-md border shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (selectedProblem.foto && target.src !== selectedProblem.foto) {
                                target.src = selectedProblem.foto;
                              }
                            }}
                          />
                          <a 
                            href={selectedProblem.foto} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute bottom-1 right-1 bg-black/50 p-1 rounded text-white"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ) : (
                        <div className="h-10 flex items-center justify-center bg-muted rounded text-[10px] text-muted-foreground">
                          Sem foto anexa
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Overlay>
              )}
            </Map>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemsMap;
