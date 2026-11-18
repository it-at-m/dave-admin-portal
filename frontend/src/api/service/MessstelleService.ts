import type {
  BackendIdDTO,
  EditMessstelleDTO,
  GetBearbeiteMessstelleRequest,
  MessstelleOverviewDTO,
  UpdateMessstelleRequest,
} from "@/api/client";

import { Configuration, MessstelleControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class MessstelleService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new MessstelleControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getMessstelleToEdit(id: string): Promise<EditMessstelleDTO> {
    const request = { id: id } as GetBearbeiteMessstelleRequest;

    return handleOpenApiError(
      this.API.getBearbeiteMessstelleRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Laden der Messstellen ist ein Fehler aufgetreten."
    );
  }

  static getAllMessstellenForOverview(): Promise<Array<MessstelleOverviewDTO>> {
    return handleOpenApiError(
      this.API.getAllMessstellenForOverviewRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Laden aller offenen Messstellen ist ein Fehler aufgetreten."
    );
  }

  static saveMessstelle(data: EditMessstelleDTO): Promise<BackendIdDTO> {
    const request = { editMessstelleDTO: data } as UpdateMessstelleRequest;

    return handleOpenApiError(
      this.API.updateMessstelleRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Aktualisieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
