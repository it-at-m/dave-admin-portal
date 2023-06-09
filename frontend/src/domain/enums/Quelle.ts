import KeyVal from "@/domain/KeyVal";

export enum Quelle {
    // manuelle Erhebung
    MANUALLY = "MANUALLY",
    // Detektorzählung
    DETECTOR = "DETECTOR",
    // Seitenradar
    RADAR = "RADAR",
    // Videoerhebung
    VIDEO = "VIDEO",
}

export default Quelle;

export const quelleDropDown = new Array<KeyVal>(
    { value: Quelle.MANUALLY, text: "Händisch" },
    { value: Quelle.DETECTOR, text: "Detektor" },
    { value: Quelle.RADAR, text: "Radar" },
    { value: Quelle.VIDEO, text: "Video" }
);
