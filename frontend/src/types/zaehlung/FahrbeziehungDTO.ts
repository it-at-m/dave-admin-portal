import type BaseEntity from "@/types/common/BaseEntity";
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";

export default interface FahrbeziehungDTO extends BaseEntity {
  // Kreuzung
  von: number;
  nach: number;

  // Kreisverkehr
  knotenarm: number;
  hinein: boolean;
  heraus: boolean;
  vorbei: boolean;

  hochrechnungsfaktor: HochrechnungsfaktorDTO;

  active: boolean;

  // nur im Frontend
  indexKey: string;
  kreisverkehrTyp: string;
}
