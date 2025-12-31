import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ReportForm from "@/components/ReportForm";
import AssociationCard from "@/components/AssociationCard";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="min-h-screen bg-background/85 backdrop-blur-sm">
        <Header />
        <main className="max-w-lg mx-auto pb-safe">
          <HeroSection />
          <ServicesGrid />
          <ReportForm />
          <AssociationCard />
        </main>
      </div>
    </div>
  );
};

export default Index;
