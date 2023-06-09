import BaseEntity from "@/domain/BaseEntity";
import GeoPoint from "@/domain/GeoPoint";
import Wetter from "@/domain/enums/Wetter";
import Zaehldauer from "@/domain/enums/Zaehldauer";
import Quelle from "@/domain/enums/Quelle";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import Status from "@/domain/enums/Status";
import Zaehlart from "@/domain/enums/Zaehlart";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";

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
