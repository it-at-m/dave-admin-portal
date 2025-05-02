import type BackendIdDTO from "@/types/common/BackendIdDTO";
import type NextZaehlstellennummerDTO from "@/types/zaehlstelle/NextZaehlstellennummerDTO";
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";

import FetchService from "@/api/service/FetchService";

export default class ZaehlstellenService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/zaehlstelle";

  static getNextZaehlstellennummer(
    id: string,
    stadtbezirksnummer: number
  ): Promise<NextZaehlstellennummerDTO> {
    return FetchService.getData(
      `${this.ENDPOINT}/nextZaehlstellennummer?id=${id}&stadtbezirksnummer=${stadtbezirksnummer}`,
      "Beim Holen der nächsten Zählstellennummer ist ein Fehler aufgetreten."
    );
  }

  static saveZaehlstelle(data: ZaehlstelleDTO): Promise<BackendIdDTO> {
    return FetchService.postData(
      data,
      `${this.ENDPOINT}/save`,
      "Beim Importieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getZaehlstelleById(id: string): Promise<ZaehlstelleDTO> {
    return FetchService.getData(
      `${this.ENDPOINT}/editZaehlstelle?id=${id}`,
      "Beim holen der Zählstelle ist ein Fehler aufgetreten."
    );
  }

  static getZaehlstellenByUnreadMessages(): Promise<ZaehlstelleDTO[]> {
    return FetchService.getData(
      `${this.ENDPOINT}/unread-messages`,
      "Beim Holen der ungelesenen Nachrichten ist ein Fehler aufgetreten."
    );
  }
}
