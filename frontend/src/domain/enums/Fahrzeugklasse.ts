enum Fahrzeugklasse {
    RAD = "RAD",
    SUMME_KFZ = "SUMME_KFZ",
    ZWEI_PLUS_EINS = "ZWEI_PLUS_EINS",
    ACHT_PLUS_EINS = "ACHT_PLUS_EINS",
}

export const FahrzeugklasseToBeschreibung = new Map<
    Fahrzeugklasse | string,
    string
>([
    [Fahrzeugklasse.RAD, "Rad"],
    [Fahrzeugklasse.SUMME_KFZ, "Summe KFZ"],
    [Fahrzeugklasse.ZWEI_PLUS_EINS, "2+1"],
    [Fahrzeugklasse.ACHT_PLUS_EINS, "8+1"],
]);

export default Fahrzeugklasse;
