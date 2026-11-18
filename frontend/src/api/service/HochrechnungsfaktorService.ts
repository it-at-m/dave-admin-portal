import type {
  DeleteHochrechnungsfaktorRequest,
  HochrechnungsfaktorDTO,
  SaveHochrechnungsfaktor1Request,
  SaveHochrechnungsfaktorRequest,
} from "@/api/client";

import { Configuration, HochrechnungsfaktorControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class HochrechnungsfaktorService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new HochrechnungsfaktorControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getAllHochrechnungsfaktoren(): Promise<Array<HochrechnungsfaktorDTO>> {
    return handleOpenApiError(
      this.API.getAllHochrechnungsfaktorenRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Laden der Hochrechnungsfaktoren ist ein Fehler aufgetreten."
    );
  }

  static postHochrechnungsfaktor(
    data: HochrechnungsfaktorDTO
  ): Promise<HochrechnungsfaktorDTO> {
    const request = {
      hochrechnungsfaktorDTO: data,
    } as SaveHochrechnungsfaktorRequest;

    return handleOpenApiError(
      this.API.saveHochrechnungsfaktorRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Speichern des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static putHochrechnungsfaktor(
    data: HochrechnungsfaktorDTO
  ): Promise<HochrechnungsfaktorDTO> {
    const request = {
      hochrechnungsfaktorDTO: data,
    } as SaveHochrechnungsfaktor1Request;

    return handleOpenApiError(
      this.API.saveHochrechnungsfaktor1Raw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Aktualisieren des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static deleteHochrechnungsfaktor(data: HochrechnungsfaktorDTO): Promise<any> {
    const request = { id: data.id } as DeleteHochrechnungsfaktorRequest;

    return handleOpenApiError(
      this.API.deleteHochrechnungsfaktor(request),
      "Beim Löschen des Hochrechnungsfaktors ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
