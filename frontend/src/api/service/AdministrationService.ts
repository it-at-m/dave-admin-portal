import FetchService from "@/api/service/FetchService";

export default class AdministrationService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/administration";

  static resetAllSuggestions(): Promise<void> {
    return FetchService.getData(
      `${this.ENDPOINT}/reset-suggestions/all`,
      "Beim Zurücksetzten aller Suchvorschläge ist ein Fehler aufgetreten."
    );
  }
  static resetSuggestionsOfAllMessstellen(): Promise<void> {
    return FetchService.getData(
      `${this.ENDPOINT}/reset-suggestions/messstelle`,
      "Beim Zurücksetzten aller Suchvorschläge der Messstellen ist ein Fehler aufgetreten."
    );
  }
  static resetSuggestionsOfAllZaehlstellen(): Promise<void> {
    return FetchService.getData(
      `${this.ENDPOINT}/reset-suggestions/zaehlstelle`,
      "Beim Zurücksetzten aller Suchvorschläge der Zählstellen ist ein Fehler aufgetreten."
    );
  }
}
