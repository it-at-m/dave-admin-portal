import type { GebietseinheitenDTO } from "@/api/client";

import { StadtbezirkControllerApi } from "@/api/client/apis";
import createBackendApiConfiguration from "@/api/util/BackendApiConfiguration";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class StadtbezirkService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new StadtbezirkControllerApi(
    createBackendApiConfiguration(this.ENDPOINT)
  );

  static getGebietseinheiten(): Promise<GebietseinheitenDTO> {
    return handleOpenApiError(
      this.API.getGebietseinheiten().then((response) => response),
      "Beim Laden der Gebietseinheiten ist ein Fehler aufgetreten."
    );
  }
}
