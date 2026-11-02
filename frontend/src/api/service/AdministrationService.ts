import type { ResetAuffaelligkeitenDTO } from "@/api/client";

import { AdministrationControllerApi } from "@/api/client";
import createBackendApiConfiguration from "@/api/util/BackendApiConfiguration";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";
import { useDateUtils } from "@/util/DateUtils";

export default class AdministrationService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new AdministrationControllerApi(
    createBackendApiConfiguration(this.ENDPOINT)
  );

  static resetAuffaelligerTag(data: ResetAuffaelligkeitenDTO): Promise<void> {
    const dateUtils = useDateUtils();
    return handleOpenApiError(
      this.API.resetUnauffaelligerTag({
        resetAuffaelligkeitenDTO: data,
      }).then((response) => response),
      `Beim Aktualisieren der Auffälligkeiten für den ${dateUtils.getShortVersionOfDate(data.startDateToReset)} ist ein Fehler aufgetreten.`
    );
  }
}
