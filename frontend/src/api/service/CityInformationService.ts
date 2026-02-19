import type CityDistrictDTO from "@/types/configuration/CityDistrictDTO";

import FetchService from "@/api/service/FetchService";

export default class ConfigurationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/cityinformation";

  static getAllDistricts(): Promise<CityDistrictDTO[]> {
    return FetchService.getData(
      `${this.ENDPOINT}/all`,
      "Beim Laden der Stadtinformationen ist ein Fehler aufgetreten."
    );
  }
}