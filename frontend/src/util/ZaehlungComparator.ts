import type OpenZaehlung from "@/types/zaehlung/OpenZaehlung";

import Zaehlart from "@/types/enum/Zaehlart";

export default class ZaehlungComparator {
  /**
   * Sortiert eine Liste von ZaehlungCardObject nach dem Datum DESC
   * Neu -> Alt
   *
   * @param a
   * @param b
   */
  public static sortByDatumDesc(a: OpenZaehlung, b: OpenZaehlung): number {
    if (a.datum > b.datum) {
      return -1;
    }
    if (a.datum < b.datum) {
      return 1;
    }
    // Gibt es zwei neuste Zählungen mit dem selben Datum und eine davon ist
    // eine "klassische" Zählung, dann wird die als erstes ausgewählt.
    if (a.datum === b.datum) {
      if (a.zaehlart !== Zaehlart.N) {
        return 1;
      }
      if (a.zaehlart === Zaehlart.N) {
        return -1;
      }
    }
    return 0;
  }
}
