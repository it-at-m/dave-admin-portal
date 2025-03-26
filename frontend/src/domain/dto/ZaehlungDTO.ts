import type BaseEntity from "@/domain/BaseEntity";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import Quelle from "@/domain/enums/Quelle";
import Status from "@/domain/enums/Status";
import Wetter from "@/domain/enums/Wetter";
import Zaehlart from "@/domain/enums/Zaehlart";
import Zaehldauer from "@/domain/enums/Zaehldauer";
import GeoPoint from "@/domain/GeoPoint";
import KnotenarmDTO from "@/domain/KnotenarmDTO";

export default interface ZaehlungDTO extends BaseEntity {
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
  knotenarme: KnotenarmDTO[];
  fahrbeziehungen: FahrbeziehungDTO[];
  kategorien: string[];
  pkwEinheit: PkwEinheitDTO;
  customSuchwoerter: string[];
  unreadMessagesMobilitaetsreferat: boolean;
  monat: string;
  jahreszeit: string;
  dienstleisterkennung: string;
}
