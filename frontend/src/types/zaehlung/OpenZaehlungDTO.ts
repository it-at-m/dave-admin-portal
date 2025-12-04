import type BaseEntity from "@/types/common/BaseEntity";

import Status from "@/types/enum/Status";
import Zaehlart from "@/types/enum/Zaehlart";

export default interface OpenZaehlungDTO extends BaseEntity {
  // ZaehlstellenInfos
  zaehlstellenNummer: string;
  zaehlstellenId: string;
  stadtbezirk: string;
  // ZaehlungsInfos
  datum: string;
  zaehlart: Zaehlart;
  projektNummer: string;
  projektName: string;
  kreuzungsname: string;
  status: Status;
}
