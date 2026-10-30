import type Zaehlung from "@/types/zaehlung/Zaehlung";

export default interface ZaehlungCardObject {
  zaehlung: Zaehlung;
  // Wird für die Breite der Spalten benötig im Grid
  flex: number;
}
