import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface BusScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusScheduleModal = ({ open, onOpenChange }: BusScheduleModalProps) => {
  const weekdayEmbare = [
    "05:45", "06:15", "07:15", "08:00", "08:45", "09:30",
    "10:15", "11:00", "11:45", "12:30", "13:15", "14:00",
    "14:45", "15:30", "16:15", "17:00", "17:45", "18:30",
    "19:15", "20:45", "22:45"
  ];

  const weekdayEstacao = [
    "06:30", "07:15", "08:00", "08:45", "09:30", "10:15",
    "11:00", "11:45", "12:30", "13:15", "14:00", "14:45",
    "15:30", "16:15", "17:00", "17:45", "18:30", "20:00",
    "21:45"
  ];

  const saturdayEmbare = ["06:45", "08:15", "09:45", "11:15", "12:45", "14:15"];
  const saturdayEstacao = ["07:30", "09:00", "10:30", "12:00", "13:30"];

  const ScheduleColumn = ({ title, times }: { title: string; times: string[] }) => (
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-primary mb-2 text-center">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-1">
        {times.map((time, index) => (
          <div
            key={index}
            className="text-center text-sm py-1 px-2 bg-muted rounded"
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Linha Embaré - Estação</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="weekday" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekday">Segunda a Sexta</TabsTrigger>
            <TabsTrigger value="saturday">Sábado</TabsTrigger>
          </TabsList>

          <TabsContent value="weekday" className="mt-4">
            <div className="flex gap-4">
              <ScheduleColumn title="Saída EMBARÉ" times={weekdayEmbare} />
              <ScheduleColumn title="Saída ESTAÇÃO" times={weekdayEstacao} />
            </div>
          </TabsContent>

          <TabsContent value="saturday" className="mt-4">
            <div className="flex gap-4">
              <ScheduleColumn title="Saída EMBARÉ" times={saturdayEmbare} />
              <ScheduleColumn title="Saída ESTAÇÃO" times={saturdayEstacao} />
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-4 border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Obs: Aos Sábados e Domingos o Embaré é atendido pela Linha 13.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default BusScheduleModal;
