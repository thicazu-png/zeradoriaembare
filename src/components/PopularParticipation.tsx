import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PopularParticipation = () => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-center text-sm font-bold uppercase text-slate-700 mb-4">
        Participação Popular
      </h2>
      
      <Card className="bg-white/40 backdrop-blur-md border-white/50 shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <p className="text-center text-sm text-slate-600">
            Sua assinatura fortalece nossa cobrança por melhorias no Embaré.
          </p>
          
          <Button
            size="lg"
            className="w-full gap-3 text-base font-semibold"
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSddek4qp1sTK-08OFb0-JX0mRo_-qm3WmO_cSducSHLl4RQPA/viewform?usp=header",
                "_blank"
              )
            }
          >
            <FileText className="h-5 w-5" />
            Assinar Abaixo-Assinado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopularParticipation;
