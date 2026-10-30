import { MessstelleKarteDTOStatusEnum } from "@/api/client";

export const messstelleStatusText = new Map<string, string>([
  [MessstelleKarteDTOStatusEnum.InPlanung, "In Planung"],
  [MessstelleKarteDTOStatusEnum.InBestand, "In Bestand"],
  [MessstelleKarteDTOStatusEnum.AusserBetrieb, "Außer Betrieb"],
  [MessstelleKarteDTOStatusEnum.Abgebaut, "Abgebaut"],
  [MessstelleKarteDTOStatusEnum.Unbekannt, "unbekannt"],
]);
