
import FetchService from "@/api/service/FetchService";

export default class HolidaysService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/holidays";

  static importPublicHolidays(): Promise<BigInteger> {
    return FetchService.getData(
      `${this.ENDPOINT}/import-public-holidays`,
      "Beim Laden aller Anwendungskonfigurationen ist ein Fehler aufgetreten."
    );
  }

  static importSchoolHolidays(): Promise<BigInteger> {
    return FetchService.getData(
      `${this.ENDPOINT}/import-school-holidays`,
      "Beim Laden aller Anwendungskonfigurationen ist ein Fehler aufgetreten."
    );
  }
}
