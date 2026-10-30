import type { HochrechnungsfaktorDTO } from "@/api/client";

import { Configuration, HochrechnungsfaktorControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class HochrechnungsfaktorService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new HochrechnungsfaktorControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getAllHochrechnungsfaktoren(): Promise<Array<HochrechnungsfaktorDTO>> {
    return handleOpenApiError(
      this.API.getAllHochrechnungsfaktoren().then((response) =>
        response.map(this.mapToHochrechnungsfaktor)
      ),
      "Beim Laden der Hochrechnungsfaktorn ist ein Fehler aufgetreten."
    );
  }

  static postHochrechnungsfaktor(
    data: HochrechnungsfaktorDTO
  ): Promise<HochrechnungsfaktorDTO> {
    return handleOpenApiError(
      this.API.saveHochrechnungsfaktor({
        hochrechnungsfaktorDTO: {
          matrix: data.matrix,
          kfz: data.kfz,
          sv: data.sv,
          gv: data.gv,
          active: data.active,
          defaultFaktor: data.defaultFaktor,
        },
      }).then((response) => this.mapToHochrechnungsfaktor(response)),
      "Beim Speichern des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static putHochrechnungsfaktor(
    data: HochrechnungsfaktorDTO
  ): Promise<HochrechnungsfaktorDTO> {
    return handleOpenApiError(
      this.API.saveHochrechnungsfaktor({
        hochrechnungsfaktorDTO: {
          matrix: data.matrix,
          kfz: data.kfz,
          sv: data.sv,
          gv: data.gv,
          active: data.active,
          defaultFaktor: data.defaultFaktor,
        },
      }).then((response) => this.mapToHochrechnungsfaktor(response)),
      "Beim Aktualisieren des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static deleteHochrechnungsfaktor(
    data: HochrechnungsfaktorDTO
  ): Promise<object> {
    if (!data.id) {
      throw new Error(
        "Hochrechnungsfaktor mit leerer ID kann nicht gelöscht werden."
      );
    }
    return handleOpenApiError(
      this.API.deleteHochrechnungsfaktor({ id: data.id }).then(
        (response) => response
      ),
      "Beim Löschen des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  private static mapToHochrechnungsfaktor(
    dto: HochrechnungsfaktorDTO
  ): HochrechnungsfaktorDTO {
    return {
      id: dto.id ?? "",
      entityVersion: dto.entityVersion ?? 0,
      matrix: dto.matrix,
      kfz: dto.kfz ?? 0,
      sv: dto.sv ?? 0,
      gv: dto.gv ?? 0,
      active: dto.active,
      defaultFaktor: dto.defaultFaktor,
    };
  }
}
