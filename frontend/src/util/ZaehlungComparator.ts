import Zaehlart from "@/domain/enums/Zaehlart";
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";

export default class ZaehlungComparator {
    /**
     * Sortiert eine Liste von ZaehlungCardObject nach dem Datum DESC
     * Neu -> Alt
     *
     * @param a
     * @param b
     */
    public static sortByDatumDesc(
        a: OpenZaehlungDTO,
        b: OpenZaehlungDTO
    ): number {
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

    /**
     * Sortiert eine Liste von ZaehlungCardObject nach dem Datum ASC
     * Alt -> Neu
     *
     * @param a
     * @param b
     */
    public static sortByDatumAsc(
        a: OpenZaehlungDTO,
        b: OpenZaehlungDTO
    ): number {
        if (a.datum > b.datum) {
            return 1;
        }
        if (a.datum < b.datum) {
            return -1;
        }
        // Gibt es zwei neuste Zählungen mit dem selben Datum und eine davon ist
        // eine "klassische" Zählung, dann wird die als erstes ausgewählt.
        if (a.datum === b.datum) {
            if (a.zaehlart !== Zaehlart.N) {
                return -1;
            }
            if (a.zaehlart === Zaehlart.N) {
                return 1;
            }
        }
        return 0;
    }
}
