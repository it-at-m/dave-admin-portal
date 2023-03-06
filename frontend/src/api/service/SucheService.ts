import FetchService from "@/api/service/FetchService";
import SucheComplexSuggestsDTO from "@/domain/dto/suche/SucheComplexSuggestsDTO";
import ZaehlstelleKarteDTO from "@/domain/dto/ZaehlstelleKarteDTO";

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

  static searchZaehlstelle(query: string): Promise<Array<ZaehlstelleKarteDTO>> {
    return FetchService.getData(
        `${this.ENDPOINT}/search?nofilter=true&query=${query}`,
        "Beim Suchen von Zählstellen ist ein Fehler aufgetreten."
    );
  }

}
