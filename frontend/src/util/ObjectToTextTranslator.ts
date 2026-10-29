import type Hochrechnungsfaktor from "@/types/config/Hochrechnungsfaktor";

export default class ObjectToTextTranslator {
  public static getHochrechnungsfaktorAsText(hf: Hochrechnungsfaktor): string {
    return `${hf.matrix} - KFZ: ${hf.kfz} - SV: ${hf.sv} - GV: ${hf.gv}`;
  }
}
