import type { DienstleisterDTO } from "@/api/client";

import { Configuration, DienstleisterControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class DienstleisterService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new DienstleisterControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static save(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    return handleOpenApiError(
      this.API.saveDienstleister({ dienstleisterDTO: data }).then(
        (response) => response
      ),
      "Beim Speichern des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static update(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    return handleOpenApiError(
      this.API.saveDienstleister({ dienstleisterDTO: data }).then(
        (response) => response
      ),
      "Beim Aktualisieren des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAll(): Promise<DienstleisterDTO[]> {
    return handleOpenApiError(
      this.API.getAllDienstleister().then((response) => response),
      "Beim Laden der Dienstleister ist ein Fehler aufgetreten."
    );
  }

  static getAllActive(): Promise<DienstleisterDTO[]> {
    return handleOpenApiError(
      this.API.getAllActiveDienstleister().then((response) => response),
      "Beim Laden der aktiven Dienstleister ist ein Fehler aufgetreten."
    );
  }

  static delete(data: DienstleisterDTO): Promise<object> {
    if (!data.id) {
      throw new Error(
        "Dienstleister mit leerer ID kann nicht gelöscht werden."
      );
    }
    return handleOpenApiError(
      this.API.deleteDienstleister({ id: data.id }).then(
        (response) => response
      ),
      "Beim Löschen des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
