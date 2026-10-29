import type {
  GeoPoint as ApiGeoPoint,
  BackendIdDTO,
  BearbeiteVerkehrsbeziehungDTO,
  BearbeiteZaehlstelleDTO,
  BearbeiteZaehlungDTO,
  LadeZaehlstelleWithUnreadMessageDTO,
  NextZaehlstellennummerDTO,
  PkwEinheitDTO,
} from "@/api/client";
import type BaseEntity from "@/types/common/BaseEntity";
import type GeoPoint from "@/types/common/GeoPoint";
import type PkwEinheit from "@/types/common/PkwEinheit";
import type Zaehlstelle from "@/types/zaehlstelle/Zaehlstelle";
import type Verkehrsbeziehung from "@/types/zaehlung/Verkehrsbeziehung";
import type Zaehlung from "@/types/zaehlung/Zaehlung";

import { Configuration, ZaehlstelleControllerApi } from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

export default class ZaehlstellenService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new ZaehlstelleControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getNextZaehlstellennummer(
    id: string,
    stadtbezirksnummer: number
  ): Promise<NextZaehlstellennummerDTO> {
    return handleOpenApiError(
      this.API.getNextCurrentNumber({ id, stadtbezirksnummer }),
      "Beim Holen der nächsten Zählstellennummer ist ein Fehler aufgetreten."
    );
  }

  static saveZaehlstelle(data: Zaehlstelle): Promise<BackendIdDTO> {
    return handleOpenApiError(
      this.API.saveZaehlstelle({
        bearbeiteZaehlstelleDTO: this.mapToBearbeiteZaehlstelleDTO(data),
      }),
      "Beim Importieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  static getZaehlstelleById(id: string): Promise<Zaehlstelle> {
    return handleOpenApiError(
      this.API.getEditZaehlstelle({ id }).then((response) =>
        this.mapToZaehlstelle(response)
      ),
      "Beim Holen der Zählstelle ist ein Fehler aufgetreten."
    );
  }

  static getZaehlstellenByUnreadMessages(): Promise<Zaehlstelle[]> {
    return handleOpenApiError(
      this.API.getZaehlstellenWithUnreadMessages().then((response) =>
        response.map((data) =>
          this.mapFromLadeZaehlstelleWithUnreadMessageDTO(data)
        )
      ),
      "Beim Holen der ungelesenen Nachrichten ist ein Fehler aufgetreten."
    );
  }

  private static mapToBearbeiteZaehlstelleDTO(
    obj: Zaehlstelle
  ): BearbeiteZaehlstelleDTO {
    return {
      id: obj.id,
      nummer: obj.nummer,
      stadtbezirkNummer: obj.stadtbezirkNummer,
      stadtbezirk: obj.stadtbezirk,
      punkt: this.mapToGeoPoint(obj.punkt),
      lat: obj.lat,
      lng: obj.lng,
      customSuchwoerter: obj.customSuchwoerter,
      zaehlungen: obj.zaehlungen.map((z) => this.mapToZaehlung(z)),
      kommentar: obj.kommentar,
      sichtbarDatenportal: obj.sichtbarDatenportal,
    };
  }

  private static mapToBaseEntity(id?: string, entityVersion = 0): BaseEntity {
    return {
      id: id ?? "",
      entityVersion,
      createdTime: "",
    };
  }

  private static mapToGeoPoint(point: GeoPoint): ApiGeoPoint;
  private static mapToGeoPoint(point: ApiGeoPoint): GeoPoint;
  private static mapToGeoPoint(
    point: GeoPoint | ApiGeoPoint
  ): GeoPoint | ApiGeoPoint {
    if (typeof point.lat === "string" || typeof point.lon === "string") {
      return {
        lat: Number.parseFloat(String(point.lat ?? 0)),
        lon: Number.parseFloat(String(point.lon ?? 0)),
      };
    }

    return {
      lat: String(point.lat ?? 0),
      lon: String(point.lon ?? 0),
    };
  }

  private static mapToPkwEinheit(dto: PkwEinheitDTO | undefined): PkwEinheit;
  private static mapToPkwEinheit(
    value: PkwEinheit | PkwEinheitDTO | undefined
  ): PkwEinheit | PkwEinheitDTO {
    if (value && "id" in value) {
      return {
        pkw: value.pkw,
        lkw: value.lkw,
        lastzuege: value.lastzuege,
        busse: value.busse,
        kraftraeder: value.kraftraeder,
        fahrradfahrer: value.fahrradfahrer,
        fussgaenger: value.fussgaenger,
      };
    }

    return {
      ...this.mapToBaseEntity(),
      pkw: value?.pkw ?? 0,
      lkw: value?.lkw ?? 0,
      lastzuege: value?.lastzuege ?? 0,
      busse: value?.busse ?? 0,
      kraftraeder: value?.kraftraeder ?? 0,
      fahrradfahrer: value?.fahrradfahrer ?? 0,
      fussgaenger: value?.fussgaenger ?? 0,
    };
  }

  private static mapToBearbeiteVerkehrsbeziehungen(
    obj: Zaehlung
  ): BearbeiteVerkehrsbeziehungDTO[] {
    return obj.verkehrsbeziehungen.map(
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
    );
  }

  private static mapToVerkehrsbeziehungen(
    dtos: BearbeiteVerkehrsbeziehungDTO[],
    kreisverkehr: boolean
  ): Verkehrsbeziehung[] {
    return dtos.map(
      ({
        id,
        isKreuzung,
        von,
        nach,
        knotenarm,
        hinein,
        heraus,
        vorbei,
        strassenseite,
        hochrechnungsfaktor,
      }) => ({
        ...this.mapToBaseEntity(id),
        isKreuzung: isKreuzung ?? !kreisverkehr,
        von: von ?? 0,
        nach: nach ?? 0,
        knotenarm: knotenarm ?? 0,
        hinein: hinein ?? false,
        heraus: heraus ?? false,
        vorbei: vorbei ?? false,
        strassenseite: strassenseite!,
        hochrechnungsfaktor: hochrechnungsfaktor
          ? {
              ...this.mapToBaseEntity(
                hochrechnungsfaktor.id,
                hochrechnungsfaktor.entityVersion
              ),
              matrix: hochrechnungsfaktor.matrix,
              kfz: hochrechnungsfaktor.kfz ?? 0,
              sv: hochrechnungsfaktor.sv ?? 0,
              gv: hochrechnungsfaktor.gv ?? 0,
              active: hochrechnungsfaktor.active,
              defaultFaktor: hochrechnungsfaktor.defaultFaktor,
            }
          : {
              ...this.mapToBaseEntity(),
              matrix: "",
              kfz: 0,
              sv: 0,
              gv: 0,
              active: false,
              defaultFaktor: false,
            },
        active: false,
        indexKey: "",
        kreisverkehrTyp: "",
      })
    );
  }

  private static mapFromLadeZaehlstelleWithUnreadMessageDTO(
    dto: LadeZaehlstelleWithUnreadMessageDTO
  ): Zaehlstelle {
    return {
      ...this.mapToBaseEntity(dto.id),
      nummer: dto.nummer ?? "",
      name: "",
      stadtbezirk: "",
      stadtbezirkNummer: 0,
      punkt: this.mapToGeoPoint({ lat: dto.lat, lon: dto.lng }),
      lat: dto.lat ?? 0,
      lng: dto.lng ?? 0,
      customSuchwoerter: [],
      zaehlungen: (dto.zaehlungen ?? []).map((zaehlung) =>
        this.mapFromBearbeiteZaehlung({
          datum: zaehlung.datum,
          lat: 0,
          lng: 0,
          projektName: zaehlung.projektName,
          sonderzaehlung: false,
          kreisverkehr: false,
          zaehlIntervall: 0,
          unreadMessagesMobilitaetsreferat:
            zaehlung.unreadMessagesMobilitaetsreferat ?? false,
        })
      ),
      kommentar: "",
      sichtbarDatenportal: false,
    };
  }

  private static mapToZaehlstelle(dto: BearbeiteZaehlstelleDTO): Zaehlstelle {
    return {
      ...this.mapToBaseEntity(dto.id),
      nummer: dto.nummer ?? "",
      name: "",
      stadtbezirk: dto.stadtbezirk ?? "",
      stadtbezirkNummer: dto.stadtbezirkNummer,
      punkt: this.mapToGeoPoint(dto.punkt ?? { lat: dto.lat, lon: dto.lng }),
      lat: dto.lat,
      lng: dto.lng,
      customSuchwoerter: dto.customSuchwoerter ?? [],
      zaehlungen: (dto.zaehlungen ?? []).map((zaehlung) =>
        this.mapFromBearbeiteZaehlung(zaehlung)
      ),
      kommentar: dto.kommentar ?? "",
      sichtbarDatenportal: dto.sichtbarDatenportal ?? false,
    };
  }

  private static mapFromBearbeiteZaehlung(dto: BearbeiteZaehlungDTO): Zaehlung {
    return {
      ...this.mapToBaseEntity(dto.id),
      datum: dto.datum?.toISOString().substring(0, 10) ?? "",
      punkt: this.mapToGeoPoint(dto.punkt ?? { lat: dto.lat, lon: dto.lng }),
      projektNummer: dto.projektNummer ?? "",
      projektName: dto.projektName ?? "",
      kreuzungsname: dto.kreuzungsname ?? "",
      sonderzaehlung: dto.sonderzaehlung,
      kreisverkehr: dto.kreisverkehr,
      zaehlsituation: dto.zaehlsituation ?? "",
      zaehlsituationErweitert: dto.zaehlsituationErweitert ?? "",
      zaehlIntervall: dto.zaehlIntervall,
      kommentar: dto.kommentar ?? "",
      wetter: dto.wetter as Zaehlung["wetter"],
      status: dto.status as Zaehlung["status"],
      zaehldauer: dto.zaehldauer as Zaehlung["zaehldauer"],
      quelle: dto.quelle as Zaehlung["quelle"],
      zaehlart: dto.zaehlart as Zaehlung["zaehlart"],
      knotenarme: (dto.knotenarme ?? []).map(({ nummer, strassenname }) => ({
        ...this.mapToBaseEntity(),
        nummer: nummer ?? 0,
        strassenname: strassenname ?? "",
      })),
      laengsverkehr: (dto.laengsverkehr ?? []).map(
        ({ id, knotenarm, richtung, strassenseite }) => ({
          ...this.mapToBaseEntity(id),
          knotenarm: knotenarm ?? 0,
          richtung: richtung!,
          strassenseite: strassenseite!,
        })
      ),
      querungsverkehr: (dto.querungsverkehr ?? []).map(
        ({ id, knotenarm, richtung }) => ({
          ...this.mapToBaseEntity(id),
          knotenarm: knotenarm ?? 0,
          richtung: richtung!,
        })
      ),
      verkehrsbeziehungen: this.mapToVerkehrsbeziehungen(
        dto.verkehrsbeziehungen ?? [],
        dto.kreisverkehr
      ),
      kategorien: (dto.kategorien ?? []) as Zaehlung["kategorien"],
      pkwEinheit: this.mapToPkwEinheit(dto.pkwEinheit),
      customSuchwoerter: dto.customSuchwoerter ?? [],
      unreadMessagesMobilitaetsreferat: dto.unreadMessagesMobilitaetsreferat,
      monat: dto.monat ?? "",
      jahreszeit: dto.jahreszeit ?? "",
      dienstleisterkennung: dto.dienstleisterkennung ?? "",
    };
  }

  private static mapToZaehlung(obj: Zaehlung): BearbeiteZaehlungDTO {
    return {
      id: obj.id,
      datum: new Date(obj.datum),
      zaehlart: obj.zaehlart,
      punkt: this.mapToGeoPoint(obj.punkt),
      lat: Number.parseFloat(obj.punkt.lat),
      lng: Number.parseFloat(obj.punkt.lon),
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
      pkwEinheit: this.mapToPkwEinheit(obj.pkwEinheit),
      knotenarme: obj.knotenarme.map(({ nummer, strassenname }) => ({
        nummer,
        strassenname,
      })),
      laengsverkehr: obj.laengsverkehr.map(
        ({ id, knotenarm, richtung, strassenseite }) => ({
          id,
          knotenarm,
          richtung,
          strassenseite,
        })
      ),
      querungsverkehr: obj.querungsverkehr.map(
        ({ id, knotenarm, richtung }) => ({ id, knotenarm, richtung })
      ),
      verkehrsbeziehungen: this.mapToBearbeiteVerkehrsbeziehungen(obj),
      unreadMessagesMobilitaetsreferat: obj.unreadMessagesMobilitaetsreferat,
      dienstleisterkennung: obj.dienstleisterkennung,
    };
  }
}
