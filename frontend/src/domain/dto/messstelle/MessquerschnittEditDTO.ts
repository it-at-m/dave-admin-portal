import BaseEntity from "@/domain/BaseEntity";

export default interface MessquerschnittEditDTO extends BaseEntity {
    mqId: string;
    strassenname: string;
    lageMessquerschnitt: string;
    fahrtrichtung: string;
    latitude: number;
    longitude: number;
    anzahlFahrspuren: number;
    fahrzeugKlassen: string;
    detektierteVerkehrsarten: string;
    hersteller: string;
    anzahlDetektoren: number;
    standort: string;
}
