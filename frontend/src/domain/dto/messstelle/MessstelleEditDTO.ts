import BaseEntity from "@/domain/BaseEntity";
import MessquerschnittEditDTO from "@/domain/dto/messstelle/MessquerschnittEditDTO";

export default interface MessstelleEditDTO extends BaseEntity {
    mstId: string;
    name: string;
    status: string;
    stadtbezirk: string;
    stadtbezirkNummer: string;
    bemerkung: string;
    latitude: number;
    longitude: number;
    realisierungsdatum: string;
    abbaudatum: string;
    datumLetztePlausibleMessung: string;

    customSuchwoerter: string[];
    kommentar: string;
    standort: string;
    geprueft: boolean;
    sichtbarDatenportal: boolean;

    messquerschnitte: Array<MessquerschnittEditDTO>;
}
