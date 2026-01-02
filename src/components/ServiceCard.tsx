import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  imageSrc?: string;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  bgColor: string;
  href: string;
  isExternal?: boolean;
}

const ServiceCard = ({
  imageSrc,
  icon: Icon,
  title,
  subtitle,
  bgColor,
  href,
  isExternal = true,
}: ServiceCardProps) => {
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50",
        "bg-card shadow-card hover:shadow-elevated transition-all duration-200",
        "hover:-translate-y-0.5 active:scale-[0.98] w-full h-[130px]",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "no-underline"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-xl mb-3",
          bgColor
        )}
      >
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-10 h-10 object-contain rounded-md"
          />
        ) : Icon ? (
          <Icon className="w-8 h-8 text-foreground" />
        ) : null}
      </div>
      <span className="text-sm font-semibold text-foreground text-center leading-tight">
        {title}
      </span>
      {subtitle && (
        <span className="text-xs text-muted-foreground mt-0.5">{subtitle}</span>
      )}
    </a>
  );
};

export default ServiceCard;
