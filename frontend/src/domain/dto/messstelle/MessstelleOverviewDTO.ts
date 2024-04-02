import BaseEntity from "@/domain/BaseEntity";
import { MessstelleStatus } from "@/domain/enums/MessstelleStatus";

export default interface MessstelleOverviewDTO extends BaseEntity {
    mstId: string;
    name: string;
    status: MessstelleStatus;
    geprueft: boolean;
    sichtbarDatenportal: boolean;
    stadtbezirk: string;
    stadtbezirkNummer: string;
}
