import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import FetchService from "@/api/service/FetchService";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import MessstelleOverviewDTO from "@/domain/dto/messstelle/MessstelleOverviewDTO";

export default class MessstelleService {
    private static readonly ENDPOINT: string =
        "api/dave-backend-service/messstelle";

    static getMessstelleToEdit(id: string): Promise<MessstelleEditDTO> {
        return FetchService.getData(
            `${this.ENDPOINT}/edit?id=${id}`,
            "Beim Laden der Messstellen ist ein Fehler aufgetreten."
        );
    }

    static getAllMessstellenForOverview(): Promise<
        Array<MessstelleOverviewDTO>
    > {
        return FetchService.getData(
            `${this.ENDPOINT}/loadAllMessstellenForOverview`,
            "Beim Laden aller offenen Messstellen ist ein Fehler aufgetreten."
        );
    }

    static saveMessstelle(data: MessstelleEditDTO): Promise<BackendIdDTO> {
        return FetchService.patchData(
            data,
            `${this.ENDPOINT}/update`,
            "Beim Aktualisieren der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
        );
    }
}
