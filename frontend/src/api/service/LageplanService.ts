import type { DocumentDto } from "@/api/client";

import { LageplanControllerApi } from "@/api/client";
import createBackendApiConfiguration from "@/api/util/BackendApiConfiguration";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class LageplanService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new LageplanControllerApi(
    createBackendApiConfiguration(this.ENDPOINT)
  );

  static loadLageplan(messstelleId: string): Promise<DocumentDto> {
    return handleOpenApiError(
      this.API.loadLageplan({ mstId: messstelleId }).then((response) =>
        this.mapToLageplan(response)
      ),
      "Beim Laden des Lageplans ist ein Fehler aufgetreten."
    );
  }

  private static mapToLageplan(dto: DocumentDto): DocumentDto {
    return {
      url: dto.url ?? "",
    };
  }
}
