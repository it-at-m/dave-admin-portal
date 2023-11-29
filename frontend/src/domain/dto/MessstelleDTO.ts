import BaseEntity from "@/domain/BaseEntity";

export default interface MessstelleDTO extends BaseEntity {
    name: string;
    stadtbezirkNummer: number;
    lat: number;
    lng: number;
    customSuchwoerter: string[];
    kommentar: string;
    sichtbarDatenportal: boolean;
}
