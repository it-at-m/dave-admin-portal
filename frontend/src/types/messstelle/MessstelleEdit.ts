import type { MessstelleKarteDTOStatusEnum, Verkehrsart } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";
import type MessfaehigkeitEdit from "@/types/messstelle/MessfaehigkeitEdit";
import type MessquerschnittEdit from "@/types/messstelle/MessquerschnittEdit";

export default interface MessstelleEdit extends BaseEntity {
  mstId: string;
  name: string;
  status: MessstelleKarteDTOStatusEnum;
  stadtbezirk: string;
  stadtbezirkNummer: string;
  bemerkung: string;
  latitude: number;
  longitude: number;
  realisierungsdatum: string;
  abbaudatum: string;
  datumLetztePlausibleMessung: string;
  fahrzeugklasse: string;
  detektierteVerkehrsart: Verkehrsart;
  hersteller: string;

  customSuchwoerter: Array<string>;
  kommentar: string;
  standort: string;
  geprueft: boolean;
  sichtbarDatenportal: boolean;
  lageplanVorhanden: boolean;

  messquerschnitte: Array<MessquerschnittEdit>;
  messfaehigkeiten: Array<MessfaehigkeitEdit>;
}
