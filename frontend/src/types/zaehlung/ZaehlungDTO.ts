import type BaseEntity from "@/types/common/BaseEntity";
import type GeoPoint from "@/types/common/GeoPoint";
import type PkwEinheitDTO from "@/types/common/PkwEinheitDTO";
import type Fahrzeug from "@/types/enum/Fahrzeug";
import type FahrbeziehungDTO from "@/types/zaehlung/FahrbeziehungDTO";
import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";

import Quelle from "@/types/enum/Quelle";
import Status from "@/types/enum/Status";
import Wetter from "@/types/enum/Wetter";
import Zaehlart from "@/types/enum/Zaehlart";
import Zaehldauer from "@/types/enum/Zaehldauer";

export default interface ZaehlungDTO extends BaseEntity {
  datum: string;
  punkt: GeoPoint;
  projektNummer: string;
  projektName: string;
  kreuzungsname: string;
  sonderzaehlung: boolean;
  dauerzaehlung: boolean;
  kreisverkehr: boolean;
  zaehlsituation: string;
  zaehlsituationErweitert: string;
  zaehlIntervall: number;
  kommentar: string;
  wetter: Wetter;
  status: Status;
  zaehldauer: Zaehldauer;
  quelle: Quelle;
  zaehlart: Zaehlart;
  knotenarme: KnotenarmDTO[];
  fahrbeziehungen: FahrbeziehungDTO[];
  kategorien: Array<Fahrzeug>;
  pkwEinheit: PkwEinheitDTO;
  customSuchwoerter: string[];
  unreadMessagesMobilitaetsreferat: boolean;
  monat: string;
  jahreszeit: string;
  dienstleisterkennung: string;
}
