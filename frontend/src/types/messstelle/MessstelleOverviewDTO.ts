import type BaseEntity from "@/types/common/BaseEntity";

import { MessstelleStatus } from "@/types/enum/MessstelleStatus";

export default interface MessstelleOverviewDTO extends BaseEntity {
  mstId: string;
  name: string;
  status: MessstelleStatus;
  geprueft: boolean;
  sichtbarDatenportal: boolean;
  stadtbezirk: string;
  stadtbezirkNummer: string;
}
