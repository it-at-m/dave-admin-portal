import type AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";
import type SearchAndFilterOptionsDTO from "@/types/suche/SearchAndFilterOptionsDTO";
import type SucheComplexSuggestsDTO from "@/types/suche/SucheComplexSuggestsDTO";

import FetchService from "@/api/service/FetchService";

export default class SucheService {
  private static readonly ENDPOINT: string = "api/dave-backend-service";

  // Die Query muss als letzter Parameter mitgeschickt werden, damit mögliche Leerzeichen
  // am Ende automatisch entfernt werden
  static getSuggestions(query: string): Promise<SucheComplexSuggestsDTO> {
    return FetchService.getData(
      `${this.ENDPOINT}/suggest?nofilter=true&query=${query}`,
      "Beim Lesen der Vorschläge ist ein Fehler aufgetreten."
    );
  }

  static searchErhebungsstelle(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<Array<AnzeigeKarteDTO>> {
    return FetchService.postData(
      searchAndFilterOptions,
      `${this.ENDPOINT}/search?query=${query}`,
      "Beim Suchen von Zähl-/Messstellen ist ein Fehler aufgetreten."
    );
  }
}
