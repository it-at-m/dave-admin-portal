import FetchService from "@/api/service/FetchService";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import UpdateStatusDTO from "@/domain/dto/bearbeiten/UpdateStatusDTO";
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";

export default class ZaehlungService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/zaehlung";

  static saveZaehlung(data: ZaehlungDTO, zaehlstelleId: String): Promise<BackendIdDTO> {
    return FetchService.postData(data, `${this.ENDPOINT}/save?zaehlstelle_id=${zaehlstelleId}`, "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }

  static deleteZaehlungById(id: string): Promise<boolean> {
    return FetchService.getData(`${this.ENDPOINT}/delete?zaehlung_id=${id}`, "Beim Löschen der Zählung ist ein Fehler aufgetreten.");
  }

  static updateStatus(data: UpdateStatusDTO): Promise<BackendIdDTO> {
    return FetchService.postData(data, `${this.ENDPOINT}/updateStatus`, "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }

  static getAllOpenZaehlungen(): Promise<OpenZaehlungDTO[]> {
    return FetchService.getData(`${this.ENDPOINT}/loadAllOpenZaehlungen`, "Beim Laden aller offenen Zählungen ist ein Fehler aufgetreten.");
  }
  
  static updateDienstleisterkennung(zaehlungId: string, dienstleister: DienstleisterDTO): Promise<BackendIdDTO> {
    return FetchService.postData(dienstleister, `${this.ENDPOINT}/updateDienstleisterkennung?zaehlung_id=${zaehlungId}`, "Beim Aktualisieren des zugewiesenen Dienstleisters ist ein Fehler aufgetreten.")
  }
}
