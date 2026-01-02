import { useEffect } from "react";
import ReportForm from "@/components/ReportForm";
import ServicesGrid from "@/components/ServicesGrid";
import BusinessList from "@/components/BusinessList";
import ProblemsMap from "@/components/ProblemsMap";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  // Define o título da página
  useEffect(() => {
    document.title = "Zeladoria Jd. Embaré";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 overflow-x-hidden selection:bg-purple-200">
      {/* --- CABEÇALHO / HEADER --- */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="inline-block mb-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm">
          <span className="text-xs font-semibold text-purple-700 tracking-wider uppercase">
            Associação de Moradores
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight">Olá, vizinho! 👋</h1>

        {/* TEXTO ATUALIZADO AQUI 👇 */}
        <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto leading-relaxed font-medium bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30">
          App Oficial Jd. Embaré 🏡 Reporte problemas, acesse serviços úteis e Associe-se à AMBJE. Praticidade para
          cuidar do nosso bairro!
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8 px-0 sm:px-4">
        {/* 1. MAPA DA TRANSPARÊNCIA (NO TOPO) */}
        <section className="px-4 sm:px-0">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center justify-center gap-2">
              🗺️ Mapa da Transparência
            </h2>
            <p className="text-xs text-slate-500">Veja o que já foi reportado no bairro</p>
          </div>

          {/* Container de Vidro para o Mapa */}
          <div className="bg-white/30 backdrop-blur-md p-2 sm:p-4 rounded-3xl border border-white/50 shadow-xl shadow-indigo-500/10">
            <ProblemsMap />
          </div>
        </section>

        {/* CHAMADA VISUAL ENTRE MAPA E FORMULÁRIO */}
        <div className="flex items-center justify-center py-2 opacity-80">
          <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 text-xs font-medium text-slate-600 shadow-sm animate-pulse">
            👇 Viu algum problema não listado? Reporte abaixo
          </div>
        </div>

        {/* 2. FORMULÁRIO DE REPORTAR */}
        <section className="px-4 sm:px-0" id="reportar">
          <ReportForm />
        </section>

        {/* 3. SERVIÇOS ÚTEIS */}
        <section className="px-4 sm:px-0">
          <ServicesGrid />
        </section>

        {/* 4. GUIA COMERCIAL */}
        <section className="px-0 sm:px-0">
          <BusinessList />
        </section>
      </main>

      {/* RODAPÉ DE VERSÃO (FIXO NO CANTO) */}
      <div className="fixed bottom-2 right-2 z-50 pointer-events-none">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-[10px] text-slate-500 px-2 py-1 rounded-full shadow-lg">
          v2026.01.01
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
