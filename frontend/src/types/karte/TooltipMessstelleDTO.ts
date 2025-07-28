import type Verkehrsart from "@/domain/enums/Verkehrsart";

export default interface TooltipMessstelleDTO {
  mstId: string;
  standort: string;
  stadtbezirk: string;
  stadtbezirknummer: number;
  realisierungsdatum: string;
  abbaudatum: string;
  datumLetztePlausibleMessung: string;
  detektierteVerkehrsart: Verkehrsart;
}
