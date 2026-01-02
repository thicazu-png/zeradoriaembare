import { useState, useEffect } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, AlertTriangle } from "lucide-react";

interface Problem {
  categoria: string;
  endereco: string;
  descricao: string;
  data?: string;
  foto?: string;
  lat?: number;
  lng?: number;
}

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTkFHbb6cFQG6d2LkiKhPkIWL9udehfsWxhqSFM77Z_BT0LIuB1GBNpiJJPl1KGfo/exec";

// Center of Jardim Embaré - São Carlos, SP
const MAP_CENTER: [number, number] = [-21.966260500240534, -47.93432760869767];
const DEFAULT_ZOOM = 16;

// Bounding box to limit map navigation (approximate area around Jardim Embaré)
const MAP_BOUNDS = {
  ne: [-21.975, -47.915] as [number, number], // Northeast corner
  sw: [-21.995, -47.937] as [number, number], // Southwest corner
};

// Category colors for markers
const getCategoryColor = (categoria: string): string => {
  const cat = categoria?.toLowerCase() || "";
  
  if (cat.includes("iluminação") || cat.includes("iluminacao") || cat.includes("lâmpada") || cat.includes("lampada")) {
    return "#f1c40f"; // Yellow
  }
  if (cat.includes("buraco") || cat.includes("asfalto")) {
    return "#34495e"; // Dark gray
  }
  if (cat.includes("mato") || cat.includes("limpeza") || cat.includes("capina")) {
    return "#27ae60"; // Green
  }
  if (cat.includes("vazamento") || cat.includes("água") || cat.includes("agua") || cat.includes("esgoto")) {
    return "#3498db"; // Blue
  }
  if (cat.includes("lixo") || cat.includes("entulho")) {
    return "#e74c3c"; // Red
  }
  return "#9b59b6"; // Purple for others
};

const getCategoryEmoji = (categoria: string): string => {
  const cat = categoria?.toLowerCase() || "";
  
  if (cat.includes("iluminação") || cat.includes("iluminacao") || cat.includes("lâmpada")) return "💡";
  if (cat.includes("buraco") || cat.includes("asfalto")) return "🕳️";
  if (cat.includes("mato") || cat.includes("limpeza")) return "🌿";
  if (cat.includes("vazamento") || cat.includes("água") || cat.includes("esgoto")) return "💧";
  if (cat.includes("lixo") || cat.includes("entulho")) return "🗑️";
  return "📍";
};

const ProblemsMap = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${WEBHOOK_URL}?type=denuncias`);
        if (!response.ok) throw new Error("Erro ao carregar dados");
        const data = await response.json();
        
        // Filter only problems with valid coordinates
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
            <h2 className="text-xl font-bold text-center uppercase text-foreground mb-4 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Mapa de Ocorrências
            </h2>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4 text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
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
            Ocorrências reportadas no bairro
          </p>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f1c40f" }}></span>
              💡 Iluminação
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#34495e" }}></span>
              🕳️ Buraco
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27ae60" }}></span>
              🌿 Mato
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3498db" }}></span>
              💧 Água
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#e74c3c" }}></span>
              🗑️ Lixo
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border border-border">
            <Map
              height={300}
              defaultCenter={MAP_CENTER}
              defaultZoom={DEFAULT_ZOOM}
              minZoom={13}
              maxZoom={18}
              onClick={() => setSelectedProblem(null)}
            >
              {problems.map((problem, index) => (
                <Marker
                  key={index}
                  width={40}
                  anchor={[Number(problem.lat), Number(problem.lng)]}
                  color={getCategoryColor(problem.categoria)}
                  onClick={() => setSelectedProblem(problem)}
                />
              ))}

              {selectedProblem && selectedProblem.lat && selectedProblem.lng && (
                <Overlay
                  anchor={[Number(selectedProblem.lat), Number(selectedProblem.lng)]}
                  offset={[120, 0]}
                >
                  <Card className="w-60 shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryEmoji(selectedProblem.categoria)}</span>
                        <span className="font-semibold text-sm capitalize">
                          {selectedProblem.categoria?.replace(/-/g, " ") || "Ocorrência"}
                        </span>
                      </div>
                      
                      {selectedProblem.data && (
                        <p className="text-xs text-muted-foreground mb-1">
                          📅 {selectedProblem.data}
                        </p>
                      )}
                      
                      {selectedProblem.endereco && (
                        <p className="text-xs text-muted-foreground mb-2">
                          📍 {selectedProblem.endereco}
                        </p>
                      )}
                      
                      {selectedProblem.foto && (
                        <img
                          src={selectedProblem.foto}
                          alt="Foto do problema"
                          className="w-full h-24 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      
                      <button
                        onClick={() => setSelectedProblem(null)}
                        className="mt-2 text-xs text-primary hover:underline"
                      >
                        Fechar
                      </button>
                    </CardContent>
                  </Card>
                </Overlay>
              )}
            </Map>
          </div>

          {problems.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Nenhuma ocorrência com localização GPS registrada ainda.
            </p>
          )}

          {problems.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              {problems.length} ocorrência{problems.length > 1 ? "s" : ""} mapeada{problems.length > 1 ? "s" : ""}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemsMap;
