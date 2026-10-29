import type {
  EditMessfaehigkeitDTO as ApiEditMessfaehigkeitDTO,
  EditMessquerschnittDTO as ApiEditMessquerschnittDTO,
  MessstelleOverviewDTO as ApiMessstelleOverviewDTO,
  BackendIdDTO,
  EditMessstelleDTO,
} from "@/api/client";
import type MessfaehigkeitEdit from "@/types/messstelle/MessfaehigkeitEdit";
import type MessquerschnittEdit from "@/types/messstelle/MessquerschnittEdit";
import type MessstelleEdit from "@/types/messstelle/MessstelleEdit";
import type MessstelleOverview from "@/types/messstelle/MessstelleOverview";

import {
  Configuration,
  MessstelleControllerApi,
  MessstelleKarteDTOStatusEnum,
  Verkehrsart,
} from "@/api/client";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { handleOpenApiError } from "@/api/util/OpenApiErrorHandler";

type MessstelleBasis = Pick<
  MessstelleEdit,
  | "id"
  | "entityVersion"
  | "createdTime"
  | "mstId"
  | "name"
  | "status"
  | "stadtbezirk"
  | "stadtbezirkNummer"
  | "geprueft"
  | "sichtbarDatenportal"
>;

export default class MessstelleService {
  private static readonly ENDPOINT = `${BaseUrlProvider.getBaseUrl()}/api/dave-backend-service`;
  private static readonly API = new MessstelleControllerApi(
    new Configuration({ basePath: this.ENDPOINT })
  );

  static getMessstelleToEdit(id: string): Promise<MessstelleEdit> {
    return handleOpenApiError(
      this.API.getBearbeiteMessstelle({ id }).then((response) =>
        this.mapToMessstelleEdit(response)
      ),
      "Beim Laden der Messstellen ist ein Fehler aufgetreten."
    );
  }

  static getAllMessstellenForOverview(): Promise<Array<MessstelleOverview>> {
    return handleOpenApiError(
      this.API.getAllMessstellenForOverview().then((response) =>
        this.mapToMessstelleOverview(response)
      ),
      "Beim Laden aller offenen Messstellen ist ein Fehler aufgetreten."
    );
  }

  static saveMessstelle(data: MessstelleEdit): Promise<BackendIdDTO> {
    return handleOpenApiError(
      this.API.updateMessstelle({
        editMessstelleDTO: mapToEditMessstelleDTO(data),
      }).then((response) => response),
      "Beim Aktualisieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
    );
  }

  private static mapToMessstelleEdit(dto: EditMessstelleDTO): MessstelleEdit {
    return {
      ...mapToMessstelleBasis(dto),
      bemerkung: dto.bemerkung ?? "",
      latitude: dto.latitude ?? 0,
      longitude: dto.longitude ?? 0,
      realisierungsdatum: dto.realisierungsdatum ?? "",
      abbaudatum: dto.abbaudatum ?? "",
      datumLetztePlausibleMessung: dto.datumLetztePlausibleMessung ?? "",
      fahrzeugklasse: dto.fahrzeugklasse ?? "",
      detektierteVerkehrsart:
        dto.detektierteVerkehrsart ?? Verkehrsart.Unbekannt,
      hersteller: dto.hersteller ?? "",
      customSuchwoerter: dto.customSuchwoerter ?? [],
      kommentar: dto.kommentar ?? "",
      standort: dto.standort ?? "",
      lageplanVorhanden: dto.lageplanVorhanden ?? false,
      messquerschnitte: (dto.messquerschnitte ?? []).map(
        (messquerschnitt): MessquerschnittEdit => ({
          id: messquerschnitt.id ?? "",
          entityVersion: 0,
          createdTime: "",
          mqId: messquerschnitt.mqId ?? "",
          strassenname: messquerschnitt.strassenname ?? "",
          lageMessquerschnitt: messquerschnitt.lageMessquerschnitt ?? "",
          fahrtrichtung:
            messquerschnitt.fahrtrichtung as MessquerschnittEdit["fahrtrichtung"],
          latitude: messquerschnitt.latitude ?? 0,
          longitude: messquerschnitt.longitude ?? 0,
          anzahlFahrspuren: messquerschnitt.anzahlFahrspuren ?? 0,
          fahrzeugklasse: messquerschnitt.fahrzeugklasse ?? "",
          detektierteVerkehrsart:
            messquerschnitt.detektierteVerkehrsart as MessquerschnittEdit["detektierteVerkehrsart"],
          hersteller: messquerschnitt.hersteller ?? "",
          anzahlDetektoren: messquerschnitt.anzahlDetektoren ?? 0,
          standort: messquerschnitt.standort ?? "",
        })
      ),
      messfaehigkeiten: (dto.messfaehigkeiten ?? []).map(
        (messfaehigkeit): MessfaehigkeitEdit => ({
          gueltigAb: messfaehigkeit.gueltigAb ?? "",
          gueltigBis: messfaehigkeit.gueltigBis ?? "",
          intervall: messfaehigkeit.intervall ?? "",
          fahrzeugklasse: messfaehigkeit.fahrzeugklasse ?? "",
        })
      ),
    };
  }

  private static mapToMessstelleOverview(
    dtos: Array<ApiMessstelleOverviewDTO>
  ): Array<MessstelleOverview> {
    return dtos.map(
      (dto): MessstelleOverview => ({
        ...mapToMessstelleBasis(dto),
      })
    );
  }
}

function mapToMessstelleBasis(
  dto: EditMessstelleDTO | ApiMessstelleOverviewDTO
): MessstelleBasis {
  return {
    id: dto.id ?? "",
    entityVersion: 0,
    createdTime: "",
    mstId: dto.mstId,
    name: dto.name ?? "",
    status:
      (dto.status as MessstelleEdit["status"]) ??
      MessstelleKarteDTOStatusEnum.Unbekannt,
    stadtbezirk: dto.stadtbezirk ?? "",
    stadtbezirkNummer: dto.stadtbezirkNummer?.toString() ?? "",
    geprueft: dto.geprueft ?? false,
    sichtbarDatenportal: dto.sichtbarDatenportal ?? false,
  };
}

function mapToEditMessstelleDTO(data: MessstelleEdit): EditMessstelleDTO {
  return {
    id: data.id,
    mstId: data.mstId,
    name: data.name,
    status: data.status,
    bemerkung: data.bemerkung,
    stadtbezirk: data.stadtbezirk,
    stadtbezirkNummer: data.stadtbezirkNummer
      ? Number(data.stadtbezirkNummer)
      : undefined,
    realisierungsdatum: data.realisierungsdatum,
    abbaudatum: data.abbaudatum,
    datumLetztePlausibleMessung: data.datumLetztePlausibleMessung,
    fahrzeugklasse: data.fahrzeugklasse as EditMessstelleDTO["fahrzeugklasse"],
    detektierteVerkehrsart: data.detektierteVerkehrsart,
    hersteller: data.hersteller,
    longitude: data.longitude,
    latitude: data.latitude,
    sichtbarDatenportal: data.sichtbarDatenportal,
    geprueft: data.geprueft,
    kommentar: data.kommentar,
    standort: data.standort,
    customSuchwoerter: data.customSuchwoerter,
    messquerschnitte: data.messquerschnitte.map(
      (messquerschnitt): ApiEditMessquerschnittDTO => ({
        id: messquerschnitt.id,
        mqId: messquerschnitt.mqId,
        longitude: messquerschnitt.longitude,
        latitude: messquerschnitt.latitude,
        strassenname: messquerschnitt.strassenname,
        lageMessquerschnitt: messquerschnitt.lageMessquerschnitt,
        fahrtrichtung: messquerschnitt.fahrtrichtung,
        anzahlFahrspuren: messquerschnitt.anzahlFahrspuren,
        fahrzeugklasse: messquerschnitt.fahrzeugklasse,
        detektierteVerkehrsart: messquerschnitt.detektierteVerkehrsart,
        hersteller: messquerschnitt.hersteller,
        anzahlDetektoren: messquerschnitt.anzahlDetektoren,
        standort: messquerschnitt.standort,
      })
    ),
    messfaehigkeiten: data.messfaehigkeiten.map(
      (messfaehigkeit): ApiEditMessfaehigkeitDTO => ({
        gueltigAb: messfaehigkeit.gueltigAb,
        gueltigBis: messfaehigkeit.gueltigBis,
        intervall:
          messfaehigkeit.intervall as ApiEditMessfaehigkeitDTO["intervall"],
        fahrzeugklasse:
          messfaehigkeit.fahrzeugklasse as ApiEditMessfaehigkeitDTO["fahrzeugklasse"],
      })
    ),
    lageplanVorhanden: data.lageplanVorhanden,
  };
}
