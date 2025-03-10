import BaseEntity from "@/domain/BaseEntity";
import Himmelsrichtungen from "@/domain/enums/Himmelsrichtungen";

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
