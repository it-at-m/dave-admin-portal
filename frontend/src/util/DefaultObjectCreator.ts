import type {
  ConfigurationDTO,
  DienstleisterDTO,
  EmailAddressDTO,
  HochrechnungsfaktorDTO,
  MapConfigurationDTO,
  SearchAndFilterOptionsDTO,
  TenantConfigurationDTO,
  ZaehlstelleConfigurationDTO,
} from "@/api/client";
import type MessstelleEdit from "@/types/messstelle/MessstelleEdit";
import type Zaehlstelle from "@/types/zaehlstelle/Zaehlstelle";
import type Zaehlung from "@/types/zaehlung/Zaehlung";

import { LatLng } from "leaflet";

import { MessstelleKarteDTOStatusEnum, Verkehrsart } from "@/api/client";
import Quelle from "@/types/enum/Quelle";
import Status from "@/types/enum/Status";
import Wetter from "@/types/enum/Wetter";
import Suggest from "@/types/suche/Suggest";

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

  public static createDefaultZaehlungDTO(): Zaehlung {
    const zaehlung: Zaehlung = {} as Zaehlung;
    zaehlung.customSuchwoerter = [];
    zaehlung.knotenarme = [];
    zaehlung.querungsverkehr = [];
    zaehlung.laengsverkehr = [];
    zaehlung.verkehrsbeziehungen = [];
    zaehlung.kategorien = [];
    zaehlung.quelle = Quelle.MANUALLY;
    zaehlung.wetter = Wetter.NO_INFORMATION;
    zaehlung.status = Status.CREATED;
    zaehlung.kreisverkehr = false;
    zaehlung.sonderzaehlung = false;
    return zaehlung;
  }

  public static createDefaultZaehlstelleDTO(): Zaehlstelle {
    const zaehlstelle: Zaehlstelle = {} as Zaehlstelle;
    zaehlstelle.sichtbarDatenportal = true;
    zaehlstelle.customSuchwoerter = [];
    return zaehlstelle;
  }

  public static createDefaultMessstelleEditDTO(): MessstelleEdit {
    const messstelle: MessstelleEdit = {} as MessstelleEdit;
    messstelle.sichtbarDatenportal = false;
    messstelle.lageplanVorhanden = false;
    messstelle.status = MessstelleKarteDTOStatusEnum.InPlanung;
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
        Verkehrsart.Kfz,
        Verkehrsart.Rad,
        Verkehrsart.Unbekannt,
      ],
    } as SearchAndFilterOptionsDTO;
  }

  public static createDefaultConfigurationDTO(): ConfigurationDTO {
    return {
      zaehlstelle: this.createDefaultZaehlstelleConfigurationDTO(),
      tenant: this.createDefaultTenantConfigurationDTO(),
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
      baseLayers: [],
      overlayLayers: [],
    };
  }

  public static createDefaultTenantConfigurationDTO(): TenantConfigurationDTO {
    return {
      datenportalHeader: "",
      mapConfiguration: this.createDefaultMapConfigurationDTO(),
    };
  }
}
