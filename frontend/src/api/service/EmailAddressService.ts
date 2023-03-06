import FetchService from "@/api/service/FetchService";
import EmailAddressDTO from "@/domain/dto/EmailAddressDTO";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";

export default class EmailAddressService {

  private static readonly ENDPOINT: string = "api/dave-backend-service/email-address";
  
  static save(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    return FetchService.postData(data, `${this.ENDPOINT}/save`, "Beim Speichern der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }
  
  static update(data: EmailAddressDTO): Promise<EmailAddressDTO> {
    return FetchService.putData(data, `${this.ENDPOINT}/save`, "Beim Aktualiseren der Email-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
  }

  static getEmailAddressByParticipantId(id: number): Promise<EmailAddressDTO> {
    return FetchService.getData(`${this.ENDPOINT}/emailAddressByParticipantId?participantId=${id}`, "Beim Holen der Email-Adresse ist ein Fehler aufgetreten.");
  }
  
  static getEmailAddresses(): Promise<Array<EmailAddressDTO>> {
    return FetchService.getData(`${this.ENDPOINT}/emailAddresses`, "Beim Laden der Email-Adressen ist ein Fehler aufgetreten.");
  }
  
  static delete(data: EmailAddressDTO): Promise<void> {
    return FetchService.deleteData(
      `${this.ENDPOINT}/delete/${data.id}`,
      "Beim Löschen der E-Mail-Adresse ist ein Fehler aufgetreten. Bitte Daten kontrollieren.",
      data
    );
  }
}