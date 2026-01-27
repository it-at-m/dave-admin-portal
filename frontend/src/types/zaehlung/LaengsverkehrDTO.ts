import type BaseEntity from "@/types/common/BaseEntity";
import type Himmelsrichtung from "@/types/enum/Himmelsrichtung";
import type Bewegungsrichtung from "@/types/enum/Bewegungsrichtung";

export default interface LaengsverkehrDTO extends BaseEntity {

  richtung: Bewegungsrichtung;

  strassenseite: Himmelsrichtung;

}
