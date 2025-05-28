import FetchService from "@/api/service/FetchService";

export default class AdministrationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/administration";

  static reloadUnauffaelligerTag(datum: Date): Promise<void> {
    return FetchService.getData(
      `${this.ENDPOINT}/reload-unauffaelliger-tag?date_to_reload=${datum}`,
      "Beim Neuladen des Unauffälligen Tages ist ein Fehler aufgetreten."
    );
  }
}
