import BaseEntity from "@/domain/BaseEntity";
import MessquerschnittEditDTO from "@/domain/dto/messstelle/MessquerschnittEditDTO";
import { MessstelleStatus } from "@/domain/enums/MessstelleStatus";
import MessfaehigkeitEditDTO from "@/domain/dto/messstelle/MessfaehigkeitEditDTO";

export default interface MessstelleEditDTO extends BaseEntity {
    mstId: string;
    name: string;
    status: MessstelleStatus;
    stadtbezirk: string;
    stadtbezirkNummer: string;
    bemerkung: string;
    latitude: number;
    longitude: number;
    realisierungsdatum: string;
    abbaudatum: string;
    datumLetztePlausibleMessung: string;
    fahrzeugKlassen: string;
    detektierteVerkehrsarten: string;
    hersteller: string;

    customSuchwoerter: string[];
    kommentar: string;
    standort: string;
    geprueft: boolean;
    sichtbarDatenportal: boolean;
    lageplanVorhanden: boolean;

    messquerschnitte: Array<MessquerschnittEditDTO>;
    messfaehigkeiten: Array<MessfaehigkeitEditDTO>;
}
