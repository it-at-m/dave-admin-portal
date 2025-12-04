import type MessstelleStatus from "@/types/enum/MessstelleStatus";
import type AnzeigeKarteDTO from "@/types/karte/AnzeigeKarteDTO";
import type TooltipMessstelleDTO from "@/types/karte/TooltipMessstelleDTO";

export default interface MessstelleKarteDTO extends AnzeigeKarteDTO {
  tooltip: TooltipMessstelleDTO;
  status: MessstelleStatus;
}
