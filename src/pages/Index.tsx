import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ReportForm from "@/components/ReportForm";
import ProblemsMap from "@/components/ProblemsMap";
import AssociationCard from "@/components/AssociationCard";
import CommunityGroups from "@/components/CommunityGroups";
import PartnerAction from "@/components/PartnerAction";
import BusinessList from "@/components/BusinessList";
import PopularParticipation from "@/components/PopularParticipation";
import Footer from "@/components/Footer";
import InstallGuideModal from "@/components/InstallGuideModal";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
      className="min-h-screen bg-cover bg-center bg-fixed opacity-100"
    >
      <div className="min-h-screen bg-background/85 backdrop-blur-sm">
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

          <p className="text-center text-sm text-muted-foreground font-bold px-4 py-2">
            Não encontrou o problema no mapa?<br />
            👇 Reporte abaixo
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

          <section id="participacao">
            <PopularParticipation />
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
                <Button variant="outline" className="gap-2">
                  📲 Como instalar este App
                </Button>
              }
            />
          </section>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </div>
  );
};

export default Index;