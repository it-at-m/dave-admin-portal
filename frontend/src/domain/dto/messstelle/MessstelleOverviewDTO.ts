import BaseEntity from "@/domain/BaseEntity";

export default interface MessstelleOverviewDTO extends BaseEntity {
    mstId: string;
    name: string;
    geprueft: boolean;
    sichtbarDatenportal: boolean;
}
