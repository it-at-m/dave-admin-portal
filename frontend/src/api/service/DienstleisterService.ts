import FetchService from "@/api/service/FetchService";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";

export default class DienstleisterService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/dienstleister";

  static save(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    return FetchService.postData(data, `${this.ENDPOINT}/save`, "Beim Speichern des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }
  
  static update(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    return FetchService.putData(data, `${this.ENDPOINT}/save`, "Beim Aktualisieren des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }

  static getAll(): Promise<DienstleisterDTO[]> {
    return FetchService.getData(`${this.ENDPOINT}/getAll`, "Beim Laden der Dienstleister ist ein Fehler aufgetreten.");
  }
  
  static getAllActive(): Promise<DienstleisterDTO[]> {
    return FetchService.getData(`${this.ENDPOINT}/getAllActive`, "Beim Laden der aktiven Dienstleister ist ein Fehler aufgetreten.");
  }
  
  static delete(data: DienstleisterDTO): Promise<void> {
    return FetchService.deleteData(
      `${this.ENDPOINT}/delete/${data.id}`,
      "Beim Löschen des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren.",
      data
    );
  }
}
