
import FetchService from "@/api/service/FetchService";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import XsrfTokenExtractor from "@/api/util/XsrfTokenExtractor";
import { ApiError, Levels } from "@/api/error";

export default class ZaehlstellenImageService {
  private static readonly ENDPOINT: string =
    "api/dave-backend-service/zaehlstelleimage";

  static getByZaehlstelleId(id: string): Promise<string> {
    return FetchService.getData(
      `${this.ENDPOINT}/${id}`,
      "Beim holen des Bildes der Zählstelle ist ein Fehler aufgetreten."
    );
  }

  static getByZaehlstelleIdAsFile(id: string): Promise<Blob> {
    return FetchService.getForBlob(
      `${this.ENDPOINT}/as-file/${id}`,
      "Beim Holen des Bildes der Zählstelle als Datei ist ein Fehler aufgetreten."
    );
  }

  static uploadImage(id: string, file: File): Promise<any> {
    const url = `${BaseUrlProvider.getBaseUrl()}/${this.ENDPOINT}/${id}`;
    const formData = new FormData();
    formData.append('image', file);

    const headers = new Headers({
      "Accept-Language": "de-DE",
      "X-XSRF-TOKEN": XsrfTokenExtractor.getXsrfToken().toString(),
    });

    const request: RequestInit = {
      method: "POST",
      body: formData,
      headers,
      mode: "cors",
      credentials: "same-origin",
      redirect: "manual",
    };

    return fetch(url, request)
      .catch((error) => {
        throw new ApiError(
          Levels.ERROR,
          `Die Verbindung zum Service konnte nicht aufgebaut werden.`,
          error
        );
      })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new ApiError(
              Levels.ERROR,
              "Beim Hochladen des Bildes ist ein Fehler aufgetreten.",
              `Fehlerhafte Anfrage an das Backend geschickt, HTTP: 400.`
            );
          } else if (response.status === 403) {
            throw new ApiError(
              Levels.ERROR,
              `Sie haben nicht die nötigen Rechte um diese Aktion durchzuführen.`
            );
          } else {
            throw new ApiError(
              Levels.ERROR,
              "Beim Hochladen des Bildes ist ein Fehler aufgetreten.",
              `HTTP ${response.status}: ${response.statusText}`
            );
          }
        }
        return response.json();
      });
  }
}