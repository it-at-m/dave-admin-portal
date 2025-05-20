import type BaseEntity from "@/types/common/BaseEntity";
import type MessstelleStatus from "@/types/enum/MessstelleStatus";
import type MessfaehigkeitEditDTO from "@/types/messstelle/MessfaehigkeitEditDTO";
import type MessquerschnittEditDTO from "@/types/messstelle/MessquerschnittEditDTO";

export default interface MessstelleEditDTO extends BaseEntity {
  mstId: string;
  name: string;
  status: MessstelleStatus;
  stadtbezirk: string;
  stadtbezirkNummer: string;
  bemerkung: string;
  latitude: number;
  longitude: number;
  realisierungsdatum: string;
  abbaudatum: string;
  datumLetztePlausibleMessung: string;
  fahrzeugklasse: string;
  detektierteVerkehrsarten: string;
  hersteller: string;

  customSuchwoerter: Array<string>;
  kommentar: string;
  standort: string;
  geprueft: boolean;
  sichtbarDatenportal: boolean;
  lageplanVorhanden: boolean;

  messquerschnitte: Array<MessquerschnittEditDTO>;
  messfaehigkeiten: Array<MessfaehigkeitEditDTO>;
}
