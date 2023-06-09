import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";

export default class ObjectToTextTranslator {
    public static getHochrechnungsfaktorAsText(
        hf: HochrechnungsfaktorDTO
    ): string {
        return `${hf.matrix} - KFZ: ${hf.kfz} - SV: ${hf.sv} - GV: ${hf.gv}`;
    }
}
