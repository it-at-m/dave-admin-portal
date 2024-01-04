import Suggest from "@/domain/Suggest";
import { LatLng } from "leaflet";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import Wetter from "@/domain/enums/Wetter";
import Quelle from "@/domain/enums/Quelle";
import Status from "@/domain/enums/Status";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import EmailAddressDTO from "@/domain/dto/EmailAddressDTO";

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
}
