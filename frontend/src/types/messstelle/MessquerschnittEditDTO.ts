import type BaseEntity from "@/types/common/BaseEntity";

import Himmelsrichtungen from "@/types/enum/Himmelsrichtungen";

export default interface MessquerschnittEditDTO extends BaseEntity {
  mqId: string;
  strassenname: string;
  lageMessquerschnitt: string;
  fahrtrichtung: Himmelsrichtungen;
  latitude: number;
  longitude: number;
  anzahlFahrspuren: number;
  fahrzeugklasse: string;
  detektierteVerkehrsarten: string;
  hersteller: string;
  anzahlDetektoren: number;
  standort: string;
}
