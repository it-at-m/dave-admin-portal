import type ReloadAuffaelligkeitenDTO from "@/types/config/ReloadAuffaelligkeitenDTO";

import FetchService from "@/api/service/FetchService";

export default class AdministrationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/administration";

  static reloadUnauffaelligerTag(
    data: ReloadAuffaelligkeitenDTO
  ): Promise<void> {
    return FetchService.postData(
      data,
      `${this.ENDPOINT}/reload-unauffaelliger-tag`,
      "Beim Neuladen des unauffälligen Tages ist ein Fehler aufgetreten."
    );
  }
}
