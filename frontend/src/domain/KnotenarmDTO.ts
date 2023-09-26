import BaseEntity from "@/domain/BaseEntity";

export default interface KnotenarmDTO extends BaseEntity {
    nummer: number;
    strassenname: string;
}
