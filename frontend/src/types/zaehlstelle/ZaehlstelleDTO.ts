import type BaseEntity from "@/types/common/BaseEntity";
import type GeoPoint from "@/types/common/GeoPoint";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

export default interface ZaehlstelleDTO extends BaseEntity {
  nummer: string;
  name: string;
  stadtbezirk: string;
  stadtbezirkNummer: number;
  punkt: GeoPoint;
  lat: number;
  lng: number;
  customSuchwoerter: string[];
  zaehlungen: ZaehlungDTO[];
  kommentar: string;
  sichtbarDatenportal: boolean;
}
