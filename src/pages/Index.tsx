import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ReportForm from "@/components/ReportForm";
import AssociationCard from "@/components/AssociationCard";
import CommunityGroups from "@/components/CommunityGroups";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="min-h-screen bg-background/85 backdrop-blur-sm">
        <Header />
        <main className="max-w-lg mx-auto pb-safe">
          <section id="inicio">
            <HeroSection />
          </section>
          
          <section className="px-4 py-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              App Oficial Jd. Embaré 🏡<br />
              Reporte problemas, acesse serviços úteis e associe-se à AMBJE.<br />
              Praticidade para cuidar do nosso bairro!
            </p>
          </section>
          
          <section id="servicos">
            <ServicesGrid />
          </section>
          <section id="reportar">
            <ReportForm />
          </section>
          <section id="associacao">
            <AssociationCard />
          </section>
          <section id="grupos">
            <CommunityGroups />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
