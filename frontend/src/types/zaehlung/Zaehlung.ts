import type { GeoPoint, Knotenarm, PkwEinheitDTO } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";
import type Fahrzeug from "@/types/enum/Fahrzeug";
import type Laengsverkehr from "@/types/zaehlung/Laengsverkehr";
import type Querungsverkehr from "@/types/zaehlung/Querungsverkehr";
import type Verkehrsbeziehung from "@/types/zaehlung/Verkehrsbeziehung";

import { Zaehldauer } from "@/api/client";
import Quelle from "@/types/enum/Quelle";
import Status from "@/types/enum/Status";
import Wetter from "@/types/enum/Wetter";
import Zaehlart from "@/types/enum/Zaehlart";

export default interface Zaehlung extends BaseEntity {
  datum: string;
  punkt: GeoPoint;
  projektNummer: string;
  projektName: string;
  kreuzungsname: string;
  sonderzaehlung: boolean;
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
  knotenarme: Knotenarm[];
  laengsverkehr: Laengsverkehr[];
  querungsverkehr: Querungsverkehr[];
  verkehrsbeziehungen: Verkehrsbeziehung[];
  kategorien: Array<Fahrzeug>;
  pkwEinheit: PkwEinheitDTO;
  customSuchwoerter: string[];
  unreadMessagesMobilitaetsreferat: boolean;
  monat: string;
  jahreszeit: string;
  dienstleisterkennung: string;
}
