import type BaseEntity from "@/domain/BaseEntity";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import GeoPoint from "@/domain/GeoPoint";

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
