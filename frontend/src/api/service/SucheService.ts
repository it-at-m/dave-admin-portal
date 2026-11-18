import type {
  ErhebungsstelleKarteDTO,
  SearchAndFilterOptionsDTO,
  SearchErhebungsstelleForMapRequest,
  SucheComplexSuggestsDTO,
  SuggestRequest,
} from "@/api/client";

import { Configuration, SucheControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class SucheService {
  private static readonly ENDPOINT: string = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new SucheControllerApi(
    new Configuration({
      basePath: this.ENDPOINT,
    })
  );

  static getSuggestions(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<SucheComplexSuggestsDTO> {
    const request = {
      query: query,
      searchAndFilterOptionsDTO: searchAndFilterOptions,
    } as SuggestRequest;

    return handleOpenApiError(
      this.API.suggestRaw(request).then((response) => response.raw.json()),
      "Beim Lesen der Vorschläge ist ein Fehler aufgetreten."
    );
  }

  static searchErhebungsstelle(
    query: string,
    searchAndFilterOptions: SearchAndFilterOptionsDTO
  ): Promise<Array<ErhebungsstelleKarteDTO>> {
    const request = {
      query: query,
      searchAndFilterOptionsDTO: searchAndFilterOptions,
    } as SearchErhebungsstelleForMapRequest;

    return handleOpenApiError(
      this.API.searchErhebungsstelleForMapRaw(request).then((response) =>
        response.raw.json()
      ),
      "Beim Suchen von Zähl-/Messstellen ist ein Fehler aufgetreten."
    );
  }
}
