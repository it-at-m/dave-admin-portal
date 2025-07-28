import type Verkehrsart from "@/domain/enums/Verkehrsart";
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
  detektierteVerkehrsart: Verkehrsart;
  hersteller: string;
  anzahlDetektoren: number;
  standort: string;
}
