import type { MessstelleKarteDTOStatusEnum } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";

export default interface MessstelleOverviewDTO extends BaseEntity {
  mstId: string;
  name: string;
  status: MessstelleKarteDTOStatusEnum;
  geprueft: boolean;
  sichtbarDatenportal: boolean;
  stadtbezirk: string;
  stadtbezirkNummer: string;
}
