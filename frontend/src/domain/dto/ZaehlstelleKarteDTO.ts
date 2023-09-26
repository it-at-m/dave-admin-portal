import TooltipDTO from "@/domain/dto/TooltipDTO";

export default interface ZaehlstelleKarteDTO {
    id: string;

    nummer: string;

    letzteZaehlungId: string;

    longitude: string;

    latitude: string;

    tooltip: TooltipDTO;
}
