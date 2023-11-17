import TooltipDTO from "@/domain/dto/TooltipDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export default interface ZaehlstelleKarteDTO extends AnzeigeKarteDTO{

    nummer: string;

    letzteZaehlungId: string;

    tooltip: TooltipDTO;
}
