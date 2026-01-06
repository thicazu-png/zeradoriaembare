import { useState } from "react";
import ServiceCard from "./ServiceCard";
import BusScheduleModal from "./BusScheduleModal";
import logoCpfl from "@/assets/logo-cpfl.png";
import logoSaae from "@/assets/logo-saae.png";
import logoPmesp from "@/assets/logo-pmesp.png";
import logoGcm from "@/assets/logo-gcm.png";
import logoOuvidoria from "@/assets/logo-ouvidoria.png";
import logoSouTransportes from "@/assets/logo-sou-transportes.png";
import logoSaoCarlosAmbiental from "@/assets/logo-sao-carlos-ambiental.png";

const ServicesGrid = () => {
  const [busModalOpen, setBusModalOpen] = useState(false);

  const services = [
    {
      imageSrc: logoCpfl,
      title: "Falta de Luz",
      subtitle: "CPFL",
      bgColor: "bg-cpfl-bg",
      href: "https://wa.me/5519999088888?text=Ola,%20gostaria%20de%20reportar%20falta%20de%20energia",
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
      subtitle: "Polícia Militar",
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
    {
      imageSrc: logoOuvidoria,
      title: "Ouvidoria",
      subtitle: "Prefeitura",
      bgColor: "bg-background",
      href: "https://servico.saocarlos.sp.gov.br/ouvidoria/",
      isExternal: true,
    },
    {
      imageSrc: logoSaoCarlosAmbiental,
      title: "Coleta de Lixo",
      subtitle: "São Carlos Ambiental",
      bgColor: "bg-green-50",
      href: "https://wa.link/2qz3q8",
      isExternal: true,
    },
  ];

  return (
    <section id="servicos" className="px-4 py-6">
      <h3 className="text-lg font-bold text-foreground mb-2 uppercase text-center">
        Serviços Essenciais
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Utilize os canais digitais (Site/WhatsApp) para serviços públicos e discagem direta para emergências (Polícia/GCM).
      </p>
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
        {/* Bus Schedule Card - opens modal instead of external link */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: `${services.length * 100}ms` }}
        >
          <button
            onClick={() => setBusModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-elevated hover:bg-white/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] w-full h-[130px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-3 bg-amber-50">
              <img
                src={logoSouTransportes}
                alt="Horários de Ônibus"
                className="w-10 h-10 object-contain rounded-md"
              />
            </div>
            <span className="text-sm font-semibold text-foreground text-center leading-tight">
              Horários de Ônibus
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              SOU Transportes
            </span>
          </button>
        </div>
      </div>

      <BusScheduleModal open={busModalOpen} onOpenChange={setBusModalOpen} />
    </section>
  );
};

export default ServicesGrid;
