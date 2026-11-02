import type { Himmelsrichtung, HochrechnungsfaktorDTO } from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";

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

  hochrechnungsfaktor: HochrechnungsfaktorDTO;

  // nur im Frontend
  active: boolean;
  indexKey: string;
  kreisverkehrTyp: string;
}
