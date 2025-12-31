import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ReportForm from "@/components/ReportForm";
import AssociationCard from "@/components/AssociationCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto pb-safe">
        <HeroSection />
        <ServicesGrid />
        <ReportForm />
        <AssociationCard />
      </main>
    </div>
  );
};

export default Index;
