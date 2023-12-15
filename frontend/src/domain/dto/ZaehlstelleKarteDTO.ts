import TooltipZaehlstelleDTO from "@/domain/dto/TooltipZaehlstelleDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export default interface ZaehlstelleKarteDTO extends AnzeigeKarteDTO {
    nummer: string;

    letzteZaehlungId: string;

    tooltip: TooltipZaehlstelleDTO;
}
