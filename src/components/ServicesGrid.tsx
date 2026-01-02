import { useState } from "react";
import ServiceCard from "./ServiceCard";
import BusScheduleModal from "./BusScheduleModal";
import logoCpfl from "@/assets/logo-cpfl.png";
import logoSaae from "@/assets/logo-saae.png";
import logoPmesp from "@/assets/logo-pmesp.png";
import logoGcm from "@/assets/logo-gcm.png";
import logoOuvidoria from "@/assets/logo-ouvidoria.png";
import logoSouTransportes from "@/assets/logo-sou-transportes.png";

const ServicesGrid = () => {
  const [busModalOpen, setBusModalOpen] = useState(false);

  const services = [
    {
      imageSrc: logoCpfl,
      title: "Falta de Luz",
      subtitle: "CPFL",
      bgColor: "bg-amber-50",
      href: "https://wa.me/5519999088888?text=Ola,%20gostaria%20de%20reportar%20falta%20de%20energia",
      isExternal: true,
    },
    {
      imageSrc: logoSaae,
      title: "Falta de Água",
      subtitle: "SAAE",
      bgColor: "bg-blue-50",
      href: "https://wa.me/558003001520?text=Ola,%20preciso%20de%20atendimento",
      isExternal: true,
    },
    {
      imageSrc: logoPmesp,
      title: "Segurança",
      subtitle: "Polícia Militar",
      bgColor: "bg-red-50",
      href: "tel:190",
      isExternal: false,
    },
    {
      imageSrc: logoGcm,
      title: "Guarda Municipal",
      subtitle: "Prefeitura",
      bgColor: "bg-purple-50",
      href: "tel:153",
      isExternal: false,
    },
    {
      imageSrc: logoOuvidoria,
      title: "Ouvidoria",
      subtitle: "Prefeitura",
      bgColor: "bg-slate-50",
      href: "https://servico.saocarlos.sp.gov.br/ouvidoria/",
      isExternal: true,
    },
  ];

  return (
    <section id="servicos" className="px-4 py-6">
      <div className="glass-card p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase text-center">
          Serviços Essenciais
        </h3>
        <p className="text-sm text-slate-600 text-center mb-6">
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
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-glass hover:bg-white/60 hover:scale-105 transition-all duration-200 active:scale-[0.98] w-full h-[130px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-3 bg-amber-50">
                <img
                  src={logoSouTransportes}
                  alt="Horários de Ônibus"
                  className="w-10 h-10 object-contain rounded-md"
                />
              </div>
              <span className="text-sm font-semibold text-slate-800 text-center leading-tight">
                Horários de Ônibus
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                SOU Transportes
              </span>
            </button>
          </div>
        </div>
      </div>

      <BusScheduleModal open={busModalOpen} onOpenChange={setBusModalOpen} />
    </section>
  );
};

export default ServicesGrid;
