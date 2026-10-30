import type { PkwEinheitDTO } from "@/api/client";

import { Configuration, PkwEinheitControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class PkwEinheitenService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new PkwEinheitControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getPkweinheiten(): Promise<PkwEinheitDTO> {
    return handleOpenApiError(
      this.API.getLatestPkwEinheiten().then((response) =>
        this.mapToPkwEinheit(response)
      ),
      "Beim Laden der PKW-Einheiten ist ein Fehler aufgetreten."
    );
  }

  private static mapToPkwEinheit(dto: PkwEinheitDTO): PkwEinheitDTO {
    return {
      pkw: dto.pkw || 0,
      lkw: dto.lkw || 0,
      lastzuege: dto.lastzuege || 0,
      busse: dto.busse || 0,
      kraftraeder: dto.kraftraeder || 0,
      fahrradfahrer: dto.fahrradfahrer || 0,
      fussgaenger: dto.fussgaenger || 0,
    };
  }
}
