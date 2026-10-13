import type VerkehrsbeziehungDTO from "@/types/zaehlung/VerkehrsbeziehungDTO";

export default class VerkehrsbeziehungComparator {
  public static sortByVonAndNach(
    a: VerkehrsbeziehungDTO,
    b: VerkehrsbeziehungDTO
  ): number {
    // beide sind aktiv, dann nach von und dann nach nach
    if (a.von === b.von) {
      if (a.nach > b.nach) {
        return 1;
      }
      if (a.nach < b.nach) {
        return -1;
      }
      return 0;
    }
    if (a.von > b.von) {
      return 1;
    }
    if (a.von < b.von) {
      return -1;
    }
    return 0;
  }

  public static sortKreisverkehrByVonAndNach(
    a: VerkehrsbeziehungDTO,
    b: VerkehrsbeziehungDTO
  ): number {
    // beide sind aktiv, dann nach von und dann nach nach
    if (a.knotenarm === b.knotenarm) {
      return 0;
    }
    if (a.knotenarm > b.knotenarm) {
      return 1;
    }
    if (a.knotenarm < b.knotenarm) {
      return -1;
    }
    return 0;
  }
}
