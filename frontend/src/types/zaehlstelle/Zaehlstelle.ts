import type BaseEntity from "@/types/common/BaseEntity";
import type GeoPoint from "@/types/common/GeoPoint";
import type Zaehlung from "@/types/zaehlung/Zaehlung";

export default interface Zaehlstelle extends BaseEntity {
  nummer: string;
  name: string;
  stadtbezirk: string;
  stadtbezirkNummer: number;
  punkt: GeoPoint;
  lat: number;
  lng: number;
  customSuchwoerter: string[];
  zaehlungen: Zaehlung[];
  kommentar: string;
  sichtbarDatenportal: boolean;
}
