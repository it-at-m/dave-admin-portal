import type {
  SearchAndFilterOptionsDTO,
  SucheComplexSuggestsDTO,
} from "@/api/client";
import type AnzeigeKarte from "@/types/karte/AnzeigeKarte";

import FetchService from "@/api/service/FetchService";

export default class SucheService {
  private static readonly ENDPOINT: string = "api/dave-backend-service";

  // Die Query muss als letzter Parameter mitgeschickt werden, damit mögliche Leerzeichen
  // am Ende automatisch entfernt werden
  static getSuggestions(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<SucheComplexSuggestsDTO> {
    return FetchService.postData(
      searchAndFilterOptions,
      `${this.ENDPOINT}/suggest?query=${query}`,
      "Beim Lesen der Vorschläge ist ein Fehler aufgetreten."
    );
  }

  static searchErhebungsstelle(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<Array<AnzeigeKarte>> {
    return FetchService.postData(
      searchAndFilterOptions,
      `${this.ENDPOINT}/search?query=${query}`,
      "Beim Suchen von Zähl-/Messstellen ist ein Fehler aufgetreten."
    );
  }
}
