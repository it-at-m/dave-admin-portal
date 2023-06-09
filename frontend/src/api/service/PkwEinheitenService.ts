import FetchService from "@/api/service/FetchService";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";

export default class PkwEinheitenService {
    private static readonly ENDPOINT: string =
        "api/dave-backend-service/pkw-einheit";

    static getPkweinheiten(): Promise<PkwEinheitDTO> {
        return FetchService.getData(
            `${this.ENDPOINT}/latest`,
            "Beim Laden der PKW-Einheiten ist ein Fehler aufgetreten."
        );
    }
}
