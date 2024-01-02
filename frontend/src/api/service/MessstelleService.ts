import MessstelleDTO from "@/domain/dto/MessstelleDTO";
import FetchService from "@/api/service/FetchService";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";

export default class MessstelleService {
    private static readonly ENDPOINT: string =
        "api/dave-backend-service/messstelle";
    static getMessstelleById(id: string): Promise<MessstelleDTO> {
        return FetchService.getData(
            `${this.ENDPOINT}/edit?id=${id}`,
            "Beim holen der Messstelle ist ein Fehler aufgetreten."
        );
    }

    static saveMessstelle(data: ZaehlstelleDTO): Promise<BackendIdDTO> {
        return FetchService.postData(
            data,
            `${this.ENDPOINT}/save`,
            "Beim Speichern der Daten ist ein Fehler aufgetreten. Bitte Daten kontrollieren."
        );
    }
}
