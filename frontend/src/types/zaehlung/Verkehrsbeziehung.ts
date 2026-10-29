import type { Himmelsrichtung } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";
import type Hochrechnungsfaktor from "@/types/config/Hochrechnungsfaktor";

export default interface Verkehrsbeziehung extends BaseEntity {
  // Kreuzung
  von: number;
  nach: number;

  // Kreisverkehr
  knotenarm: number;
  hinein: boolean;
  heraus: boolean;
  vorbei: boolean;

  strassenseite: Himmelsrichtung;

  hochrechnungsfaktor: Hochrechnungsfaktor;

  // nur im Frontend
  active: boolean;
  indexKey: string;
  kreisverkehrTyp: string;
}
