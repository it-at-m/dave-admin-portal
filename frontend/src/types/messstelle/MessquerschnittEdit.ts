import type { Verkehrsart } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";

import { Himmelsrichtung } from "@/api/client";

export default interface MessquerschnittEdit extends BaseEntity {
  mqId: string;
  strassenname: string;
  lageMessquerschnitt: string;
  fahrtrichtung: Himmelsrichtung;
  latitude: number;
  longitude: number;
  anzahlFahrspuren: number;
  fahrzeugklasse: string;
  detektierteVerkehrsart: Verkehrsart;
  hersteller: string;
  anzahlDetektoren: number;
  standort: string;
}
