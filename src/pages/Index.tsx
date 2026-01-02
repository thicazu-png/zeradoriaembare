import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ReportForm from "@/components/ReportForm";
import ProblemsMap from "@/components/ProblemsMap";
import AssociationCard from "@/components/AssociationCard";
import CommunityGroups from "@/components/CommunityGroups";
import PartnerAction from "@/components/PartnerAction";
import BusinessList from "@/components/BusinessList";
import Footer from "@/components/Footer";
import InstallGuideModal from "@/components/InstallGuideModal";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        <main className="max-w-lg mx-auto pb-safe">
          <section id="inicio">
            <HeroSection />
          </section>

          <section id="servicos">
            <ServicesGrid />
          </section>

          <section id="mapa-ocorrencias">
            <ProblemsMap />
          </section>

          <p className="text-center text-sm text-slate-600 px-4 py-2 font-medium">
            Não encontrou o problema no mapa? 👇 Reporte abaixo
          </p>

          <section id="reportar">
            <ReportForm />
          </section>

          <section id="guia-comercial">
            <BusinessList />
          </section>

          <section id="associacao">
            <AssociationCard />
          </section>

          <section id="grupos">
            <CommunityGroups />
          </section>

          <section id="parceiros">
            <PartnerAction />
          </section>

          {/* Install Guide Button */}
          <section className="px-4 py-6 flex justify-center">
            <InstallGuideModal
              trigger={
                <Button variant="outline" className="gap-2 glass-card px-6 py-3 hover:bg-white/50 transition-all">
                  📲 Como instalar este App
                </Button>
              }
            />
          </section>

          {/* Version Badge */}
          <div className="flex justify-end px-4 pb-4">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-slate-500 border border-white/30">
              v2026.01.01
            </span>
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </div>
  );
};

export default Index;
