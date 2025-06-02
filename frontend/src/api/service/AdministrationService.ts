import type ResetAuffaelligkeitenDTO from "@/types/config/ResetAuffaelligkeitenDTO";

import FetchService from "@/api/service/FetchService";
import { useDateUtils } from "@/util/DateUtils";

export default class AdministrationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/administration";

  static resetAuffaelligerTag(data: ResetAuffaelligkeitenDTO): Promise<void> {
    const dateUtils = useDateUtils();
    return FetchService.postData(
      data,
      `${this.ENDPOINT}/reset-unauffaelliger-tag`,
      `Beim Aktualisieren der Auffälligkeiten für den ${dateUtils.getShortVersionOfDate(data.dateToReset)} ist ein Fehler aufgetreten.`
    );
  }
}
