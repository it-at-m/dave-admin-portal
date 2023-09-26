import BaseEntity from "@/domain/BaseEntity";
import Status from "@/domain/enums/Status";
import Zaehlart from "@/domain/enums/Zaehlart";

export default interface OpenZaehlungDTO extends BaseEntity {
    // ZaehlstellenInfos
    zaehlstellenNummer: string;
    zaehlstellenId: string;
    stadtbezirk: string;
    // ZaehlungsInfos
    datum: string;
    zaehlart: Zaehlart;
    projektNummer: string;
    projektName: string;
    kreuzungsname: string;
    status: Status;
}
