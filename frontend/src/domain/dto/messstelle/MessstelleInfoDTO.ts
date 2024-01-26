import BaseEntity from "@/domain/BaseEntity";

export default interface MessstelleInfoDTO extends BaseEntity {
    mstId: string;
    stadtbezirk: string;
    stadtbezirkNummer: string;
    latitude: number;
    longitude: number;
}
