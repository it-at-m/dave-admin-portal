import BaseEntity from "@/domain/BaseEntity";

export default interface DienstleisterDTO extends BaseEntity {
  name: string;
  kennung: string;
  emailAddresses: Array<string>;
  active: boolean;
  erasable: boolean;
  emailAddressesAsString: string;
}