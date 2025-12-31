import { Zap, Droplet, ShieldAlert, Car } from "lucide-react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = () => {
  const services = [
    {
      icon: Zap,
      title: "Falta de Luz",
      subtitle: "CPFL",
      iconColor: "text-cpfl",
      bgColor: "bg-cpfl-bg",
      href: "https://wa.me/551999908888?text=Olá, gostaria de reportar falta de energia.",
      isExternal: true,
    },
    {
      icon: Droplet,
      title: "Falta de Água",
      subtitle: "SAAE",
      iconColor: "text-saae",
      bgColor: "bg-saae-bg",
      href: "https://wa.me/551933111234?text=Olá, gostaria de reportar falta de água.",
      isExternal: true,
    },
    {
      icon: ShieldAlert,
      title: "Segurança",
      subtitle: "Polícia",
      iconColor: "text-police",
      bgColor: "bg-police-bg",
      href: "tel:190",
      isExternal: false,
    },
    {
      icon: Car,
      title: "Trânsito",
      subtitle: "Prefeitura",
      iconColor: "text-transit",
      bgColor: "bg-transit-bg",
      href: "https://www.santos.sp.gov.br/portal/transito",
      isExternal: true,
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
