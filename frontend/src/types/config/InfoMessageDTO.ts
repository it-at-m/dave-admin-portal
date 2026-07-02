import type BaseEntity from "@/types/common/BaseEntity";

export default interface InfoMessageDTO extends BaseEntity {
  content: string;
  gueltigVon: string;
  gueltigBis: string;
  gueltig: boolean;
  aktiv: boolean;
}
