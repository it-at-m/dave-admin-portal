import type { InfoMessageDTO } from "@/api/client";

import { Configuration, InfoMessageControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class InfoMessageService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new InfoMessageControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static save(data: InfoMessageDTO): Promise<Array<InfoMessageDTO>> {
    return handleOpenApiError(
      this.API.saveInfoMessage({ infoMessageDTO: data }).then(
        (response) => response
      ),
      "Beim Speichern der Infonachricht ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllInfoMessages(): Promise<Array<InfoMessageDTO>> {
    return handleOpenApiError(
      this.API.getAllInfoMessages().then((response) => response),
      "Beim Laden der Infonachrichten ist ein Fehler aufgetreten."
    );
  }

  static setAllInfoMessagesInactive(): Promise<object> {
    return handleOpenApiError(
      this.API.setAllInfoMessagesInactive().then((response) => response),
      "Beim deaktivieren der Infonachricht ist ein Fehler aufgetreten."
    );
  }
}
