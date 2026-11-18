import type { PkwEinheitDTO } from "@/api/client";

import { Configuration, PkwEinheitControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class PkwEinheitenService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new PkwEinheitControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getPkweinheiten(): Promise<PkwEinheitDTO> {
    return handleOpenApiError(
      this.API.getLatestPkwEinheitenRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Laden der PKW-Einheiten ist ein Fehler aufgetreten."
    );
  }
}
