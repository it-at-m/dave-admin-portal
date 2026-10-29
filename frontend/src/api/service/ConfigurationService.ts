import type { ConfigurationDTO } from "@/api/client";

import { ConfigurationControllerApi } from "@/api/client/apis";
import { Configuration } from "@/api/client/runtime";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ConfigurationService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ConfigurationControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getConfiguration(): Promise<ConfigurationDTO> {
    return handleOpenApiError(
      this.API.getConfiguration().then((response) => response),
      "Beim Laden der Anwendungskonfiguration ist ein Fehler aufgetreten."
    );
  }
}
