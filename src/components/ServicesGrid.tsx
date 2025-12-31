import { Zap, Droplet, ShieldAlert, Car } from "lucide-react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = () => {
  const handleCPFL = () => {
    window.open(
      "https://wa.me/551932010200?text=Olá, gostaria de reportar falta de energia.",
      "_blank"
    );
  };

  const handleSAAE = () => {
    window.open(
      "https://wa.me/551933111234?text=Olá, gostaria de reportar falta de água.",
      "_blank"
    );
  };

  const handlePolice = () => {
    window.location.href = "tel:190";
  };

  const handleTransit = () => {
    window.open("https://www.santos.sp.gov.br/portal/transito", "_blank");
  };

  const services = [
    {
      icon: Zap,
      title: "Falta de Luz",
      subtitle: "CPFL",
      iconColor: "text-cpfl",
      bgColor: "bg-cpfl-bg",
      onClick: handleCPFL,
    },
    {
      icon: Droplet,
      title: "Falta de Água",
      subtitle: "SAAE",
      iconColor: "text-saae",
      bgColor: "bg-saae-bg",
      onClick: handleSAAE,
    },
    {
      icon: ShieldAlert,
      title: "Segurança",
      subtitle: "Polícia",
      iconColor: "text-police",
      bgColor: "bg-police-bg",
      onClick: handlePolice,
    },
    {
      icon: Car,
      title: "Trânsito",
      subtitle: "Prefeitura",
      iconColor: "text-transit",
      bgColor: "bg-transit-bg",
      onClick: handleTransit,
    },
  ];

  return (
    <section id="servicos" className="px-4 py-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Serviços Essenciais
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => (
          <div
            key={service.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
