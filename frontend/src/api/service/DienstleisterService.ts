import type {
  DeleteDienstleisterRequest,
  DienstleisterDTO,
  SaveDienstleister1Request,
  SaveDienstleisterRequest,
} from "@/api/client";

import { Configuration, DienstleisterControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class DienstleisterService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new DienstleisterControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static save(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    const request = { dienstleisterDTO: data } as SaveDienstleisterRequest;

    return handleOpenApiError(
      this.API.saveDienstleisterRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Speichern des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static update(data: DienstleisterDTO): Promise<DienstleisterDTO> {
    const request = { dienstleisterDTO: data } as SaveDienstleister1Request;

    return handleOpenApiError(
      this.API.saveDienstleister1Raw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Aktualisieren des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAll(): Promise<DienstleisterDTO[]> {
    return handleOpenApiError(
      this.API.getAllDienstleisterRaw().then((response) => response.raw.json()),
      "Beim Laden der Dienstleister ist ein Fehler aufgetreten."
    );
  }

  static getAllActive(): Promise<DienstleisterDTO[]> {
    return handleOpenApiError(
      this.API.getAllActiveDienstleisterRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Laden der aktiven Dienstleister ist ein Fehler aufgetreten."
    );
  }

  static delete(data: DienstleisterDTO): Promise<any> {
    const request = { id: data.id } as DeleteDienstleisterRequest;

    return handleOpenApiError(
      this.API.deleteDienstleister(request),
      "Beim Löschen des Dienstleisters ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }
}
