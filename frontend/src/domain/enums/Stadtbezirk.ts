import KeyVal from "@/domain/KeyVal";

export const StadtbezirkToBeschreibung = new Map<number, string>([
    [1, "1 Altstadt - Lehel"],
    [2, "2 Ludwigsvorstadt - Isarvorstadt"],
    [3, "3 Maxvorstadt"],
    [4, "4 Schwabing West"],
    [5, "5 Au - Haidhausen"],
    [6, "6 Sendling"],
    [7, "7 Sendling - Westpark"],
    [8, "8 Schwanthalerhöhe"],
    [9, "9 Neuhausen - Nymphenburg"],
    [10, "10 Moosach"],
    [11, "11 Milbertshofen - Am Hart"],
    [12, "12 Schwabing - Freimann"],
    [13, "13 Bogenhausen"],
    [14, "14 Berg am Laim"],
    [15, "15 Trudering - Riem"],
    [16, "16 Ramersdorf - Perlach"],
    [17, "17 Obergiesing - Fasangarten"],
    [18, "18 Untergiesing - Harlaching"],
    [19, "19 Thalkirchen - Obersendling - Forstenried - Fürstenried - Solln"],
    [20, "20 Hadern"],
    [21, "21 Pasing - Obermenzing"],
    [22, "22 Aubing - Lochhausen - Langwied"],
    [23, "23 Allach - Untermenzing"],
    [24, "24 Feldmoching - Hasenbergl"],
    [25, "25 Laim"],
    [32, "32 Außerhalb der Stadtgrenze"],
]);

export const BeschreibungToStadtbezirk = new Map(
    [...StadtbezirkToBeschreibung].reverse()
);

export const stadtbezirke = new Array<KeyVal>(
    { value: "1", text: "1 Altstadt - Lehel" },
    { value: "2", text: "2 Ludwigsvorstadt - Isarvorstadt" },
    { value: "3", text: "3 Maxvorstadt" },
    { value: "4", text: "4 Schwabing West" },
    { value: "5", text: "5 Au - Haidhausen" },
    { value: "6", text: "6 Sendling" },
    { value: "7", text: "7 Sendling - Westpark" },
    { value: "8", text: "8 Schwanthalerhöhe" },
    { value: "9", text: "9 Neuhausen - Nymphenburg" },
    { value: "10", text: "10 Moosach" },
    { value: "11", text: "11 Milbertshofen - Am Hart" },
    { value: "12", text: "12 Schwabing - Freimann" },
    { value: "13", text: "13 Bogenhausen" },
    { value: "14", text: "14 Berg am Laim" },
    { value: "15", text: "15 Trudering - Riem" },
    { value: "16", text: "16 Ramersdorf - Perlach" },
    { value: "17", text: "17 Obergiesing - Fasangarten" },
    { value: "18", text: "18 Untergiesing - Harlaching" },
    {
        value: "19",
        text: "19 Thalkirchen - Obersendling - Forstenried - Fürstenried - Solln",
    },
    { value: "20", text: "20 Hadern" },
    { value: "21", text: "21 Pasing - Obermenzing" },
    { value: "22", text: "22 Aubing - Lochhausen - Langwied" },
    { value: "23", text: "23 Allach - Untermenzing" },
    { value: "24", text: "24 Feldmoching - Hasenbergl" },
    { value: "25", text: "25 Laim" },
    { value: "32", text: "32 Außerhalb der Stadtgrenze" }
);
