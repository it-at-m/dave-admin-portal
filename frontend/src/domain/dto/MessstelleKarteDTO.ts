import TooltipMessstelleDTO from "@/domain/dto/TooltipMessstelleDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export default interface MessstelleKarteDTO extends AnzeigeKarteDTO {
    mstId: string;

    datumLetztePlausibleMessung: string;

    tooltip: TooltipMessstelleDTO;
}
