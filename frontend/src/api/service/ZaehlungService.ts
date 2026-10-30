import type {
  BackendIdDTO,
  BearbeiteZaehlungDTO,
  DienstleisterDTO,
  OpenZaehlungDTO,
  UpdateStatusDTO,
} from "@/api/client";
import type OpenZaehlung from "@/types/zaehlung/OpenZaehlung";
import type Zaehlung from "@/types/zaehlung/Zaehlung";

import { Configuration, ZaehlungControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ZaehlungService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ZaehlungControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static saveZaehlung(
    data: Zaehlung,
    zaehlstelleId: string
  ): Promise<BackendIdDTO> {
    return handleOpenApiError(
      this.API.saveZaehlung({
        zaehlstelleId,
        bearbeiteZaehlungDTO: mapToBearbeiteZaehlungDTO(data),
      }).then((response) => response),
      "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static deleteZaehlungById(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Zählung mit leerer ID kann nicht gelöscht werden.");
    }
    return handleOpenApiError(
      this.API.deleteZaehlung({ zaehlungId: id }).then((response) => response),
      "Beim Löschen der Zählung ist ein Fehler aufgetreten."
    );
  }

  static updateStatus(data: UpdateStatusDTO): Promise<BackendIdDTO> {
    return handleOpenApiError(
      this.API.updateStatus({
        updateStatusDTO: {
          zaehlungId: data.zaehlungId,
          status: data.status,
          dienstleisterkennung: data.dienstleisterkennung,
        },
      }).then((response) => response),
      "Beim Speichern der Zählung ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getAllOpenZaehlungen(): Promise<OpenZaehlung[]> {
    return handleOpenApiError(
      this.API.loadAllOpenZaehlungen().then((response) =>
        response.map(this.mapToOpenZaehlung)
      ),
      "Beim Laden aller offenen Zählungen ist ein Fehler aufgetreten."
    );
  }

  static updateDienstleisterkennung(
    zaehlungId: string,
    dienstleister: DienstleisterDTO
  ): Promise<BackendIdDTO> {
    return handleOpenApiError(
      this.API.updateDienstleisterkennung({
        zaehlungId,
        dienstleisterDTO: dienstleister,
      }).then((response) => response),
      "Beim Aktualisieren des zugewiesenen Dienstleisters ist ein Fehler aufgetreten."
    );
  }

  private static mapToOpenZaehlung(dto: OpenZaehlungDTO): OpenZaehlung {
    return {
      id: dto.id ?? "",
      entityVersion: 0,
      createdTime: "",
      zaehlstellenNummer: dto.zaehlstellenNummer ?? "",
      zaehlstellenId: dto.zaehlstellenId ?? "",
      stadtbezirk: dto.stadtbezirk ?? "",
      datum: dto.datum?.toISOString().substring(0, 10) ?? "",
      zaehlart: dto.zaehlart as OpenZaehlung["zaehlart"],
      projektNummer: dto.projektNummer ?? "",
      projektName: dto.projektName ?? "",
      kreuzungsname: "",
      status: dto.status as OpenZaehlung["status"],
    };
  }
}

function mapToBearbeiteZaehlungDTO(obj: Zaehlung): BearbeiteZaehlungDTO {
  return {
    id: obj.id,
    datum: new Date(obj.datum),
    zaehlart: obj.zaehlart,
    punkt: obj.punkt,
    lat: obj.punkt.lat || 0,
    lng: obj.punkt.lon || 0,
    projektNummer: obj.projektNummer,
    projektName: obj.projektName,
    kreuzungsname: obj.kreuzungsname,
    sonderzaehlung: obj.sonderzaehlung,
    kreisverkehr: obj.kreisverkehr,
    kategorien: obj.kategorien as BearbeiteZaehlungDTO["kategorien"],
    zaehlsituation: obj.zaehlsituation,
    zaehlsituationErweitert: obj.zaehlsituationErweitert,
    zaehlIntervall: obj.zaehlIntervall,
    wetter: obj.wetter,
    status: obj.status,
    quelle: obj.quelle,
    zaehldauer: obj.zaehldauer,
    kommentar: obj.kommentar,
    customSuchwoerter: obj.customSuchwoerter,
    pkwEinheit: obj.pkwEinheit,
    knotenarme: (obj.knotenarme ?? []).map(({ nummer, strassenname }) => ({
      nummer: nummer ?? 0,
      strassenname: strassenname ?? "",
    })),
    laengsverkehr: (obj.laengsverkehr ?? []).map(
      ({ id, knotenarm, richtung, strassenseite }) => ({
        id,
        knotenarm,
        richtung,
        strassenseite,
      })
    ),
    querungsverkehr: (obj.querungsverkehr ?? []).map(
      ({ id, knotenarm, richtung }) => ({
        id,
        knotenarm,
        richtung,
      })
    ),
    verkehrsbeziehungen: obj.verkehrsbeziehungen.map(
      ({
        id,
        von,
        nach,
        knotenarm,
        hinein,
        heraus,
        vorbei,
        strassenseite,
      }) => ({
        id,
        isKreuzung: !obj.kreisverkehr,
        von,
        nach,
        knotenarm,
        hinein,
        heraus,
        vorbei,
        strassenseite,
      })
    ),
    unreadMessagesMobilitaetsreferat: obj.unreadMessagesMobilitaetsreferat,
    dienstleisterkennung: obj.dienstleisterkennung,
  };
}
