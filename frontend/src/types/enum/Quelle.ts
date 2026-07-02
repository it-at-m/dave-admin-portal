import type KeyVal from "@/types/common/KeyVal";

export enum Quelle {
  // manuelle Erhebung
  MANUALLY = "MANUALLY",
  // Detektorzählung
  DETECTOR = "DETECTOR",
  // Seitenradar
  RADAR = "RADAR",
  // Videoerhebung
  VIDEO = "VIDEO",
}

export default Quelle;

export const quelleDropDown = new Array<KeyVal>(
  { value: Quelle.MANUALLY, title: "Händisch" },
  { value: Quelle.DETECTOR, title: "Detektor" },
  { value: Quelle.RADAR, title: "Radar" },
  { value: Quelle.VIDEO, title: "Video" }
);
