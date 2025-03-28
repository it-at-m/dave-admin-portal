import type BaseEntity from "@/domain/BaseEntity";

export default interface InfoMessageDTO extends BaseEntity {
  content: string;
  gueltigVon: string;
  gueltigBis: string;
  gueltig: boolean;
  aktiv: boolean;
}
