import type { DocumentDto, LoadLageplanRequest } from "@/api/client";

import { Configuration, LageplanControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class LageplanService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new LageplanControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static loadLageplan(messstelleId: string): Promise<DocumentDto> {
    const request = { mstId: messstelleId } as LoadLageplanRequest;

    return handleOpenApiError(
      this.API.loadLageplanRaw(request).then((response) => response.raw.json()),
      "Beim Laden des Lageplans ist ein Fehler aufgetreten."
    );
  }
}
