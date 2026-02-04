import type ConfigurationDTO from "@/types/configuration/ConfigurationDTO";
import type ConfigurationItemDTO from "@/types/configuration/ConfigurationItemDTO";

import FetchService from "@/api/service/FetchService";

export default class ConfigurationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/configuration";

  static getConfiguration(): Promise<ConfigurationDTO> {
    return FetchService.getData(
      `${this.ENDPOINT}`,
      "Beim Laden der Anwendungskonfiguration ist ein Fehler aufgetreten."
    );
  }

  static getAllConfigurationValues(): Promise<ConfigurationItemDTO[]> {
    return FetchService.getData(
      `${this.ENDPOINT}/all`,
      "Beim Laden aller Anwendungskonfigurationen ist ein Fehler aufgetreten."
    );
  }

  static saveConfiguration(
    configuration: ConfigurationItemDTO[]
  ): Promise<ConfigurationDTO> {
    return FetchService.postData(
      configuration,
      `${this.ENDPOINT}/all`,
      "Beim Speichern der Anwendungskonfiguration ist ein Fehler aufgetreten."
    );
  }
}
