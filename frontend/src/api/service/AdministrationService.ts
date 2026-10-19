import type {
  ResetAuffaelligkeitenDTO,
  ResetUnauffaelligerTagRequest,
} from "@/api/client";

import { AdministrationControllerApi, Configuration } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";
import { useDateUtils } from "@/util/DateUtils";

export default class AdministrationService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new AdministrationControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static resetAuffaelligerTag(data: ResetAuffaelligkeitenDTO): Promise<void> {
    const request = {
      resetAuffaelligkeitenDTO: data,
    } as ResetUnauffaelligerTagRequest;

    return handleOpenApiError(
      this.API.resetUnauffaelligerTagRaw(request).then((request) =>
        request.value()
      ),
      `Beim Aktualisieren der Auffälligkeiten für den Zeitraum von ${useDateUtils().getShortVersionOfDate(data.startDateToReset)} bis ${useDateUtils().getShortVersionOfDate(data.endDateToReset)} ist ein Fehler aufgetreten.`
    );
  }
}
