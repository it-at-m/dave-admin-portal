import type DienstleisterDTO from "@/types/config/DienstleisterDTO";
import type EmailAddressDTO from "@/types/config/EmailAddressDTO";
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";
import type MessstelleEditDTO from "@/types/messstelle/MessstelleEditDTO";
import type SearchAndFilterOptionsDTO from "@/types/suche/SearchAndFilterOptionsDTO";
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { LatLng } from "leaflet";

import Verkehrsart from "@/domain/enums/Verkehrsart";
import MessstelleStatus from "@/types/enum/MessstelleStatus";
import Quelle from "@/types/enum/Quelle";
import Status from "@/types/enum/Status";
import Wetter from "@/types/enum/Wetter";
import Suggest from "@/types/suche/Suggest";
import type MapConfigurationDTO from "@/types/configuration/MapConfigurationDTO";
import type ConfigurationDTO from "@/types/configuration/ConfigurationDTO";
import type ZaehlstelleConfigurationDTO from "@/types/configuration/ZaehlstelleConfigurationDTO";

export default class DefaultObjectCreator {
  private static readonly MUNICH_CENTER_LATITUDE: number = 48.137227;
  private static readonly MUNICH_CENTER_LONGITUDE: number = 11.575517;

  public static createDefaultSuggestion(): Suggest {
    return {
      text: "",
      type: "",
      zaehlstelleId: "",
      zaehlungId: "",
      mstId: "",
      props: {},
    };
  }

  public static createCenterOfMunichLatLng(): LatLng {
    return new LatLng(
      this.MUNICH_CENTER_LATITUDE,
      this.MUNICH_CENTER_LONGITUDE
    );
  }

  public static createDefaultZaehlungDTO(): ZaehlungDTO {
    const zaehlung: ZaehlungDTO = {} as ZaehlungDTO;
    zaehlung.customSuchwoerter = [];
    zaehlung.knotenarme = [];
    zaehlung.fahrbeziehungen = [];
    zaehlung.kategorien = [];
    zaehlung.quelle = Quelle.MANUALLY;
    zaehlung.wetter = Wetter.NO_INFORMATION;
    zaehlung.status = Status.CREATED;
    zaehlung.kreisverkehr = false;
    zaehlung.sonderzaehlung = false;
    return zaehlung;
  }

  public static createDefaultZaehlstelleDTO(): ZaehlstelleDTO {
    const zaehlstelle: ZaehlstelleDTO = {} as ZaehlstelleDTO;
    zaehlstelle.sichtbarDatenportal = true;
    zaehlstelle.customSuchwoerter = [];
    return zaehlstelle;
  }

  public static createDefaultMessstelleEditDTO(): MessstelleEditDTO {
    const messstelle: MessstelleEditDTO = {} as MessstelleEditDTO;
    messstelle.sichtbarDatenportal = false;
    messstelle.lageplanVorhanden = false;
    messstelle.status = MessstelleStatus.IN_PLANUNG;
    messstelle.customSuchwoerter = [];
    messstelle.messquerschnitte = [];
    return messstelle;
  }

  public static createDefaultHochrechnungsfaktor(): HochrechnungsfaktorDTO {
    const faktor: HochrechnungsfaktorDTO = {} as HochrechnungsfaktorDTO;
    faktor.matrix = "";
    faktor.kfz = 1;
    faktor.sv = 1;
    faktor.gv = 1;
    faktor.active = false;
    faktor.defaultFaktor = false;
    return faktor;
  }

  public static createDefaulDienstleisterDTO(): DienstleisterDTO {
    const dienstleisterDTO: DienstleisterDTO = {} as DienstleisterDTO;
    dienstleisterDTO.name = "";
    dienstleisterDTO.kennung = "";
    dienstleisterDTO.emailAddresses = [];
    dienstleisterDTO.active = false;
    dienstleisterDTO.erasable = true;
    return dienstleisterDTO;
  }

  public static createDefaultEmailaddressDTO(): EmailAddressDTO {
    const emailaddressDTO: EmailAddressDTO = {} as EmailAddressDTO;
    emailaddressDTO.emailAddress = "";
    return emailaddressDTO;
  }

  public static createDefaultSearchAndFilterOptionsDTO(): SearchAndFilterOptionsDTO {
    return {
      searchInMessstellen: true,
      searchInZaehlstellen: true,
      messstelleVerkehrsart: [
        Verkehrsart.KFZ,
        Verkehrsart.RAD,
        Verkehrsart.UNBEKANNT,
      ],
    } as SearchAndFilterOptionsDTO;
  }

  public static createDefaultConfigurationDTO(): ConfigurationDTO {
    return {
      map: this.createDefaultMapConfigurationDTO(),
      zaehlstelle: this.createDefaultZaehlstelleConfigurationDTO(),
    };
  }

  public static createDefaultZaehlstelleConfigurationDTO(): ZaehlstelleConfigurationDTO {
    return {
      automaticNumberAssignment: true,
    };
  }

  public static createDefaultMapConfigurationDTO(): MapConfigurationDTO {
    return {
      // München Zentrum
      lat: "48.137227",
      lng: "11.575517",
      zoom: 12,
    };
  }
}
