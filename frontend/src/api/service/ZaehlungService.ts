import type {
  BackendIdDTO,
  BearbeiteZaehlungDTO,
  DeleteZaehlungRequest,
  DienstleisterDTO,
  OpenZaehlungDTO,
  SaveZaehlungRequest,
  UpdateDienstleisterkennungRequest,
  UpdateStatusDTO,
  UpdateStatusRequest,
} from "@/api/client";

import { Configuration, ZaehlungControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ZaehlungService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ZaehlungControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static saveZaehlung(
    data: BearbeiteZaehlungDTO,
    zaehlstelleId: string
  ): Promise<BackendIdDTO> {
    const request = {
      bearbeiteZaehlungDTO: data,
      zaehlstelleId: zaehlstelleId,
    } as SaveZaehlungRequest;

    return handleOpenApiError(
      this.API.saveZaehlungRaw(request).then((response) => response.raw.json()),
      "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static deleteZaehlungById(id: string): Promise<boolean> {
    const request = { zaehlungId: id } as DeleteZaehlungRequest;

    return handleOpenApiError(
      this.API.deleteZaehlung(request),
      "Beim Löschen der Zählung ist ein Fehler aufgetreten."
    );
  }

  static updateStatus(data: UpdateStatusDTO): Promise<BackendIdDTO> {
    const request = { updateStatusDTO: data } as UpdateStatusRequest;

    return handleOpenApiError(
      this.API.updateStatusRaw(request).then((response) => response.raw.json()),
      "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllOpenZaehlungen(): Promise<OpenZaehlungDTO[]> {
    return handleOpenApiError(
      this.API.loadAllOpenZaehlungenRaw().then((response) =>
        response.raw.json()
      ),
      "Beim Laden aller offenen Zählungen ist ein Fehler aufgetreten."
    );
  }

  static updateDienstleisterkennung(
    zaehlungId: string,
    dienstleister: DienstleisterDTO
  ): Promise<BackendIdDTO> {
    const request = {
      zaehlungId: zaehlungId,
      dienstleisterDTO: dienstleister,
    } as UpdateDienstleisterkennungRequest;

    return handleOpenApiError(
      this.API.updateDienstleisterkennungRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Aktualisieren des zugewiesenen Dienstleisters ist ein Fehler aufgetreten."
    );
  }
}
