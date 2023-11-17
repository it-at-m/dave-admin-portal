import FetchService from "@/api/service/FetchService";
import SucheComplexSuggestsDTO from "@/domain/dto/suche/SucheComplexSuggestsDTO";
import ZaehlstelleKarteDTO from "@/domain/dto/ZaehlstelleKarteDTO";
import MessstelleKarteDTO from "@/domain/dto/MessstelleKarteDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export default class SucheService {
    private static readonly ENDPOINT: string = "api/dave-backend-service";

    // Die Query muss als letzter Parameter mitgeschickt werden, damit mögliche Leerzeichen
    // am Ende automatisch entfernt werden
    static getSuggestions(query: string): Promise<SucheComplexSuggestsDTO> {
        return FetchService.getData(
            `${this.ENDPOINT}/suggest?nofilter=true&query=${query}`,
            "Beim Lesen der Vorschläge ist ein Fehler aufgetreten."
        );
    }

    static searchZaehlstelle(query: string): Promise<Array<AnzeigeKarteDTO>> {
        return FetchService.getData(
            `${this.ENDPOINT}/search?nofilter=true&query=${query}`,
            "Beim Suchen von Zählstellen ist ein Fehler aufgetreten."
        );
    }
    static getMockMessstelleKarte(): AnzeigeKarteDTO[] {
        const mstOne: MessstelleKarteDTO = {
            type: "messstelle",
            id: "randomID",
            latitude: 48.1320322,
            longitude: 11.6242116,
            tooltip: {
                mstId: "MSTID1",
                standortDatenportal: "testdatenportal",
                stadtbezirk: 13,
                realisierungsdatum: "testrealisierung",
                abbaudatum: "testabbau",
                datumLetzteMessung: "testmessung",
                kfz: true,
            },
        };

        const msttwo: MessstelleKarteDTO = {
            type: "messstelle",
            id: "randomID2",
            latitude: 48.1316995,
            longitude: 11.6227731,
            tooltip: {
                mstId: "MSTID2",
                standortDatenportal: "testdatenportal2",
                stadtbezirk: 13,
                realisierungsdatum: "testrealisierung2",
                abbaudatum: "testabbau2",
                datumLetzteMessung: "testmessung2",
                kfz: true,
            },
        };

        const mstthree: MessstelleKarteDTO = {
            type: "messstelle",
            id: "randomID",
            latitude: 48.1315995,
            longitude: 11.6217731,
            tooltip: {
                mstId: "MSTID3",
                standortDatenportal: "testdatenportal3",
                stadtbezirk: 13,
                realisierungsdatum: "testrealisierung3",
                abbaudatum: "testabbau3",
                datumLetzteMessung: "testmessung3",
                kfz: true,
            },
        };

        return [mstOne, msttwo, mstthree];
    }
}
