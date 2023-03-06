import BaseEntity from "@/domain/BaseEntity";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";

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