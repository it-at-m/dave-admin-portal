import type {
  BackendIdDTO,
  BearbeiteZaehlstelleDTO,
  GetEditZaehlstelleRequest,
  GetNextCurrentNumberRequest,
  LadeZaehlstelleWithUnreadMessageDTO,
  NextZaehlstellennummerDTO,
  SaveZaehlstelleRequest,
} from "@/api/client";

import { Configuration, ZaehlstelleControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ZaehlstellenService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ZaehlstelleControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getNextZaehlstellennummer(
    id: string,
    stadtbezirksnummer: number
  ): Promise<NextZaehlstellennummerDTO> {
    const request = {
      id: id,
      stadtbezirksnummer: stadtbezirksnummer,
    } as GetNextCurrentNumberRequest;

    return handleOpenApiError(
      this.API.getNextCurrentNumberRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Holen der nächsten Zählstellennummer ist ein Fehler aufgetreten."
    );
  }

  static saveZaehlstelle(data: BearbeiteZaehlstelleDTO): Promise<BackendIdDTO> {
    const request = { bearbeiteZaehlstelleDTO: data } as SaveZaehlstelleRequest;

    return handleOpenApiError(
      this.API.saveZaehlstelleRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Importieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getZaehlstelleById(id: string): Promise<BearbeiteZaehlstelleDTO> {
    const request = { id: id } as GetEditZaehlstelleRequest;

    return handleOpenApiError(
      this.API.getEditZaehlstelleRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim holen der Zählstelle ist ein Fehler aufgetreten."
    );
  }

  static getZaehlstellenByUnreadMessages(): Promise<
    LadeZaehlstelleWithUnreadMessageDTO[]
  > {
    return handleOpenApiError(
      this.API.getZaehlstellenWithUnreadMessagesRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Holen der ungelesenen Nachrichten ist ein Fehler aufgetreten."
    );
  }
}
