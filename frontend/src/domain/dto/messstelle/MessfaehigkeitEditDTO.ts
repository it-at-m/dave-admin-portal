import Fahrzeugklasse from "@/domain/enums/Fahrzeugklasse";
import ZaehldatenIntervall from "@/domain/enums/ZaehldatenIntervall";

export default interface MessfaehigkeitEditDTO {
    gueltigAb: string;
    gueltigBis: string;
    intervall: ZaehldatenIntervall;
    fahrzeugklassen: Fahrzeugklasse;
}
