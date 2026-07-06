
import FetchService from "@/api/service/FetchService";

export default class PublicHolidaysService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/public-holidays";

  static importPublicHolidays(): Promise<BigInteger> {
    return FetchService.getData(
      `${this.ENDPOINT}/import`,
      "Beim Laden aller Anwendungskonfigurationen ist ein Fehler aufgetreten."
    );
  }
}
