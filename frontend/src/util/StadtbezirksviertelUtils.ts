export default class StadtbezirksviertelUtils {
  /**
   * Wandelt die Nummer eines Viertels im Format "nn.n.n" in eine fortlaufende Zahl um,
   * indem die letzten beiden Zahlenteile aneinandergehängt werden.
   */
  public static convertToSequentialNumber(value: string): number {
    const match = value.match(/^\d{2}\.(\d)\.(\d)$/);
    if (!match) {
      return Number.NaN;
    }

    return Number(`${match[1]}${match[2]}`);
  }
}
