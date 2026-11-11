import { Fahrzeugklasse } from "@/api/client";

export const FahrzeugklasseToBeschreibung = new Map<
  Fahrzeugklasse | string,
  string
>([
  [Fahrzeugklasse.Rad, "Rad"],
  [Fahrzeugklasse.SummeKfz, "Summe KFZ"],
  [Fahrzeugklasse.ZweiPlusEins, "2+1"],
  [Fahrzeugklasse.AchtPlusEins, "8+1"],
]);

export default Fahrzeugklasse;
