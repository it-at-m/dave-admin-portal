import BaseEntity from "@/domain/BaseEntity";

export default interface MessstelleDTO extends BaseEntity {
    mstId: string;
    name: string;
    stadtbezirk: string;
    stadtbezirkNummer: string;
    latitude: number;
    longitude: number;
    customSuchwoerter: string[];
    kommentar: string;
    sichtbarDatenportal: boolean;
}
