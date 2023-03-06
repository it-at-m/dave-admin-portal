import FetchService from "@/api/service/FetchService";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";

export default class HochrechnungsfaktorService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/hochrechnungsfaktor";

  static getAllHochrechnungsfaktoren(): Promise<Array<HochrechnungsfaktorDTO>> {
    return FetchService.getData(
        `${this.ENDPOINT}/getAll`,
        "Beim Laden der Hochrechnungsfaktorn ist ein Fehler aufgetreten."
    );
  }

  static postHochrechnungsfaktor(data: HochrechnungsfaktorDTO): Promise<HochrechnungsfaktorDTO> {
    return FetchService.postData(
        data,
        `${this.ENDPOINT}/save`,
        "Beim Speichern des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static putHochrechnungsfaktor(data: HochrechnungsfaktorDTO): Promise<HochrechnungsfaktorDTO> {
    return FetchService.putData(
        data,
        `${this.ENDPOINT}/save`,
        "Beim Aktualisieren des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static deleteHochrechnungsfaktor(data: HochrechnungsfaktorDTO): Promise<void> {
    return FetchService.deleteData(
        `${this.ENDPOINT}/delete/${data.id}`,
        "Beim Löschen des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren.",
        data
    );
  }

}
