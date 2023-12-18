import MessstelleDTO from "@/domain/dto/MessstelleDTO";

export default class MessstelleService {
    static getMessstelleById(id: string): MessstelleDTO {
        switch (id) {
            case "randomID":
                return {
                    createdTime: "heute",
                    entityVersion: 0,
                    id: "randomID",
                    mstId: "MSTID1",
                    name: "Messstelle 1",
                    stadtbezirkNummer: 13,
                    lat: 48.1887227,
                    lng: 11.4290655,
                    customSuchwoerter: ["suchwort1", "suchwort2"],
                    kommentar: "string",
                    sichtbarDatenportal: true,
                };
            case "randomID2":
                return {
                    createdTime: "heute",
                    entityVersion: 0,
                    mstId: "MSTID2",
                    id: "randomID2",
                    name: "Messstelle 2",
                    stadtbezirkNummer: 13,
                    lat: 48.1316995,
                    lng: 11.6227731,
                    customSuchwoerter: ["suchwort1", "suchwort2"],
                    kommentar: "string",
                    sichtbarDatenportal: true,
                };
            case "randomID3":
                return {
                    createdTime: "heute",
                    entityVersion: 0,
                    id: "randomID3",
                    mstId: "MSTID3",
                    name: "Messstelle 3",
                    stadtbezirkNummer: 13,
                    lat: 48.1315995,
                    lng: 11.6217731,
                    customSuchwoerter: ["suchwort1", "suchwort2"],
                    kommentar: "string",
                    sichtbarDatenportal: true,
                };
            default:
                return {
                    createdTime: "error",
                    entityVersion: 0,
                    id: "error",
                    mstId: "error",
                    name: "error",
                    stadtbezirkNummer: 13,
                    lat: 48.1315995,
                    lng: 11.6217731,
                    customSuchwoerter: ["error", "error2"],
                    kommentar: "error",
                    sichtbarDatenportal: true,
                };
        }
    }
}
