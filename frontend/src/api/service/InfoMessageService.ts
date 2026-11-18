import type { InfoMessageDTO, SaveInfoMessageRequest } from "@/api/client";

import { Configuration, InfoMessageControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class InfoMessageService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new InfoMessageControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static save(data: InfoMessageDTO): Promise<Array<InfoMessageDTO>> {
    const request = { infoMessageDTO: data } as SaveInfoMessageRequest;

    return handleOpenApiError(
      this.API.saveInfoMessageRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Speichern der Infonachricht ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllInfoMessages(): Promise<Array<InfoMessageDTO>> {
    return handleOpenApiError(
      this.API.getAllInfoMessagesRaw().then((response) => response.raw.json()),
      "Beim Laden der Infonachrichten ist ein Fehler aufgetreten."
    );
  }

  static setAllInfoMessagesInactive(): Promise<any> {
    return handleOpenApiError(
      this.API.setAllInfoMessagesInactive(),
      "Beim deaktivieren der Infonachricht ist ein Fehler aufgetreten."
    );
  }
}
