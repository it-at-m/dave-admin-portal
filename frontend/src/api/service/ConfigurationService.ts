import type { ConfigurationDTO } from "@/api/client";

import { Configuration, ConfigurationControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ConfigurationService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ConfigurationControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getConfiguration(): Promise<ConfigurationDTO> {
    return handleOpenApiError(
      this.API.getConfigurationRaw().then((response) => response.raw.json()),
      "Beim Laden der Anwendungskonfiguration ist ein Fehler aufgetreten."
    );
  }
}
