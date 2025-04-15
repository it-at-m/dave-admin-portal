import { MessstelleStatus } from "@/types/enum/MessstelleStatus";
import AnzeigeKarteDTO from "@/types/karte/AnzeigeKarteDTO";
import TooltipMessstelleDTO from "@/types/karte/TooltipMessstelleDTO";

export default interface MessstelleKarteDTO extends AnzeigeKarteDTO {
  tooltip: TooltipMessstelleDTO;
  status: MessstelleStatus;
}
