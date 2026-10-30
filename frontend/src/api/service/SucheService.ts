import type {
  ErhebungsstelleKarteDTO,
  SearchAndFilterOptionsDTO,
  SucheComplexSuggestsDTO,
} from "@/api/client";

import { Configuration, SucheControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class SucheService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new SucheControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getSuggestions(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<SucheComplexSuggestsDTO> {
    return handleOpenApiError(
      this.API.suggest({
        query,
        searchAndFilterOptionsDTO: searchAndFilterOptions,
      }).then((response) => response),
      "Beim Lesen der Vorschläge ist ein Fehler aufgetreten."
    );
  }

  static searchErhebungsstelle(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<Array<ErhebungsstelleKarteDTO>> {
    return handleOpenApiError(
      this.API.searchErhebungsstelleForMap({
        query,
        searchAndFilterOptionsDTO: searchAndFilterOptions,
      }).then((response) => Array.from(response)),
      "Beim Suchen von Zähl-/Messstellen ist ein Fehler aufgetreten."
    );
  }
}
