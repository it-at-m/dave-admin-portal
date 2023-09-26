import BaseEntity from "@/domain/BaseEntity";

export default interface EmailAddressDTO extends BaseEntity {
    emailAddress: string;
    participantId: number;
}
