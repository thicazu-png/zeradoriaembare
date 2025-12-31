import ServiceCard from "./ServiceCard";
import logoCpfl from "@/assets/logo-cpfl.png";
import logoSaae from "@/assets/logo-saae.png";
import logoPmesp from "@/assets/logo-pmesp.png";
import logoGcm from "@/assets/logo-gcm.png";

const ServicesGrid = () => {
  const services = [
    {
      imageSrc: logoCpfl,
      title: "Falta de Luz",
      subtitle: "CPFL",
      bgColor: "bg-cpfl-bg",
      href: "https://wa.me/551999908888?text=Ola,%20gostaria%20de%20reportar%20falta%20de%20energia",
      isExternal: true,
    },
    {
      imageSrc: logoSaae,
      title: "Falta de Água",
      subtitle: "SAAE",
      bgColor: "bg-saae-bg",
      href: "https://wa.me/558003001520?text=Ola,%20preciso%20de%20atendimento",
      isExternal: true,
    },
    {
      imageSrc: logoPmesp,
      title: "Segurança",
      subtitle: "Polícia",
      bgColor: "bg-police-bg",
      href: "tel:190",
      isExternal: false,
    },
    {
      imageSrc: logoGcm,
      title: "Guarda Municipal",
      subtitle: "Prefeitura",
      bgColor: "bg-transit-bg",
      href: "tel:153",
      isExternal: false,
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
