import BaseEntity from "@/domain/BaseEntity";

export default interface HochrechnungsfaktorDTO extends BaseEntity {
    /**
     * Der eindeutige Bezeichner.
     */
    matrix: string;

    kfz: number;

    sv: number;

    gv: number;

    active: boolean;

    /**
     * Es darf nur ein DTO den Wert true aufweisen.
     * Allen anderen DTOs müssen den Wert false besitzen.
     */
    defaultFaktor: boolean;
}
