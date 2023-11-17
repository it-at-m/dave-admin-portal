import BaseEntity from "@/domain/BaseEntity";
import TooltipMessstelleDTO from "@/domain/dto/TooltipMessstelleDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export default interface MessstelleKarteDTO extends AnzeigeKarteDTO {
    type: string;
    tooltip: TooltipMessstelleDTO;
}

