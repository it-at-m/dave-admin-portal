import FetchService from "@/api/service/FetchService";
import InfoMessageDTO from "@/domain/dto/InfoMessageDTO";

export default class InfoMessageService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/infomessage";

  static save(data: InfoMessageDTO): Promise<Array<InfoMessageDTO>> {
    return FetchService.postData(data,
        `${this.ENDPOINT}/save`,
        "Beim Speichern der Infonachricht ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllInfoMessages(): Promise<Array<InfoMessageDTO>> {
    return FetchService.getData(
        `${this.ENDPOINT}/all`,
        "Beim Laden der Infonachrichten ist ein Fehler aufgetreten."
    );
  }

  static setAllInfoMessagesInactive(): Promise<void> {
    return FetchService.postData("",
        `${this.ENDPOINT}/set-all-inactive`,
        "Beim deaktivieren der Infonachricht ist ein Fehler aufgetreten."
    );
  }

}
