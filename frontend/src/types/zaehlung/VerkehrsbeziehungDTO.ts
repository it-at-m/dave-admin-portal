import type BaseEntity from "@/types/common/BaseEntity";
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";
import type Himmelsrichtung from "@/types/enum/Himmelsrichtung";

export default interface VerkehrsbeziehungDTO extends BaseEntity {
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
