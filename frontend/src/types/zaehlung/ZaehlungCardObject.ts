import type { BearbeiteZaehlungDTO } from "@/api/client";

export default interface ZaehlungCardObject {
  zaehlung: BearbeiteZaehlungDTO;
  // Wird für die Breite der Spalten benötig im Grid
  flex: number;
}
