import AnzeigeKarteDTO from "@/types/karte/AnzeigeKarteDTO";
import TooltipZaehlstelleDTO from "@/types/karte/TooltipZaehlstelleDTO";

export default interface ZaehlstelleKarteDTO extends AnzeigeKarteDTO {
  letzteZaehlungId: string;
  tooltip: TooltipZaehlstelleDTO;
}
