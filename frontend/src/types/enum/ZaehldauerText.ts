import type KeyVal from "@/types/common/KeyVal";

import { Zaehldauer } from "@/api/client";

export const zaehldauerDropDown = new Array<KeyVal>(
  {
    value: Zaehldauer.Dauer2X4Stunden,
    title: "Kurzzeiterhebung (6 bis 10 Uhr; 15 bis 19 Uhr)",
  },
  {
    value: Zaehldauer.Dauer13Stunden,
    title: "13 Stunden Zählung (6 bis 19 Uhr)",
  },
  {
    value: Zaehldauer.Dauer16Stunden,
    title: "16 Stunden Zählung (6 bis 22 Uhr)",
  },
  { value: Zaehldauer.Dauer24Stunden, title: "Ganztageszählung" },
  { value: Zaehldauer.Sonstige, title: "Sonderzähldauer" }
);
