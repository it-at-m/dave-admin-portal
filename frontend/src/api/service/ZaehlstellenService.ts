import FetchService from "@/api/service/FetchService";
import NextZaehlstellennummerDTO from "@/domain/dto/laden/NextZaehlstellennummerDTO";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";

export default class ZaehlstellenService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/zaehlstelle";

  static getNextZaehlstellennummer(id: string, stadtbezirksnummer: number): Promise<NextZaehlstellennummerDTO> {
    return FetchService.getData(`${this.ENDPOINT}/nextZaehlstellennummer?id=${id}&stadtbezirksnummer=${stadtbezirksnummer}`, "Beim Holen der nächsten Zählstellennummer ist ein Fehler aufgetreten.");
  }

  static saveZaehlstelle(data: ZaehlstelleDTO): Promise<BackendIdDTO> {
    return FetchService.postData(data, `${this.ENDPOINT}/save`, "Beim Importieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }

  static getZaehlstelleById(id: string): Promise<ZaehlstelleDTO> {
    return FetchService.getData(`${this.ENDPOINT}/editZaehlstelle?id=${id}`, "Beim holen der Zählstelle ist ein Fehler aufgetreten.");
  }

  static getZaehlstellenByUnreadMessages(participantId: number): Promise<ZaehlstelleDTO[]> {
    return FetchService.getData(`${this.ENDPOINT}/byUnreadMessages?participant=${participantId}`, "Beim Holen der ungelesenen Nachrichten ist ein Fehler aufgetreten.");
  }
}
