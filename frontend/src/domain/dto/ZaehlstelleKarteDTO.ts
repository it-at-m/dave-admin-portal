import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";
import TooltipZaehlstelleDTO from "@/domain/dto/TooltipZaehlstelleDTO";

export default interface ZaehlstelleKarteDTO extends AnzeigeKarteDTO {
    letzteZaehlungId: string;
    tooltip: TooltipZaehlstelleDTO;
}