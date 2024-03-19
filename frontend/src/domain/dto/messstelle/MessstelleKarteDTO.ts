import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";
import TooltipMessstelleDTO from "@/domain/dto/TooltipMessstelleDTO";
import {MessstelleStatus} from "@/domain/enums/MessstelleStatus";

export default interface MessstelleKarteDTO extends AnzeigeKarteDTO {
    tooltip: TooltipMessstelleDTO;
    status: MessstelleStatus;
}
