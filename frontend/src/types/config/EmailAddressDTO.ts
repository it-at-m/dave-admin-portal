import type BaseEntity from "@/types/common/BaseEntity";

export default interface EmailAddressDTO extends BaseEntity {
  emailAddress: string;
  participantId: number;
}
