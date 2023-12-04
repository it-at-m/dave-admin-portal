import MessstelleDTO from "@/domain/dto/MessstelleDTO";

export default class MessstelleService {
    static getMessstelleById(id: string): MessstelleDTO {
        return {
            createdTime: "heute",
            entityVersion: 0,
            id: "id",
            name: "NameMesstelle",
            stadtbezirkNummer: 12,
            lat: 48.1317995,
            lng: 11.6228731,
            customSuchwoerter: ["suchwort1", "suchwort2"],
            kommentar: "string",
            sichtbarDatenportal: true,
        };
    }
}
