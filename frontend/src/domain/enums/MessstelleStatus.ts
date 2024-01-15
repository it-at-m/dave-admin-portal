export const enum MessstelleStatus {
    /**
     * In Planung
     */
    IN_PLANUNG = "IN_PLANUNG",

    /**
     * In Bestand
     */
    IN_BESTAND = "IN_BESTAND",

    /**
     * AUSSER_BETRIEB
     */
    AUSSER_BETRIEB = "AUSSER_BETRIEB",

    /**
     * ABGEBAUT
     */
    ABGEBAUT = "ABGEBAUT",

    /**
     * UNBEKANNT
     */
    UNBEKANNT = "UNBEKANNT",
}

export const messstelleStatusText = new Map<string, string>([
    [MessstelleStatus.IN_PLANUNG, "In Planung"],
    [MessstelleStatus.IN_BESTAND, "In Bestand"],
    [MessstelleStatus.AUSSER_BETRIEB, "Außer Betrieb"],
    [MessstelleStatus.ABGEBAUT, "Abgebaut"],
    [MessstelleStatus.UNBEKANNT, "unbekannt"],
]);
