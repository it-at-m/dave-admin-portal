import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";

import { describe, expect, it } from "vitest";

import Fahrzeug from "@/types/enum/Fahrzeug";
import Zaehlart from "@/types/enum/Zaehlart";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { useValidationUtils } from "@/util/ValidationUtils";

describe("ValidationUtils.ts", () => {
  it("validateKnotenLageForm", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    // Fall !QJS
    zaehlung.zaehlart = Zaehlart.N;
    zaehlung.knotenarme = [];
    let result = validationUtils.validateKnotenLageForm(zaehlung);
    let expected = true;
    expect(result).toStrictEqual(expected);

    // Fall QJS
    zaehlung.zaehlart = Zaehlart.QJS;

    const knotenarm1 = {} as KnotenarmDTO;
    knotenarm1.nummer = 1;
    const knotenarm2 = {} as KnotenarmDTO;
    knotenarm2.nummer = 2;
    const knotenarm3 = {} as KnotenarmDTO;
    knotenarm3.nummer = 3;

    zaehlung.knotenarme = [];
    result = validationUtils.validateKnotenLageForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.knotenarme = [knotenarm1];
    result = validationUtils.validateKnotenLageForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.knotenarme = [knotenarm1, knotenarm2];
    result = validationUtils.validateKnotenLageForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.knotenarme = [knotenarm1, knotenarm2, knotenarm3];
    result = validationUtils.validateKnotenLageForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.knotenarme = [knotenarm1, knotenarm3];
    result = validationUtils.validateKnotenLageForm(zaehlung);
    expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrsartForm", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.N;
    zaehlung.kategorien = [];
    let result = validationUtils.validateVerkehrsartForm(zaehlung);
    let expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.kategorien = [Fahrzeug.FUSS, Fahrzeug.KRAD];
    expected = true;
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expect(result).toStrictEqual(expected);

    // Fall QJS || FJS || QU
    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.kategorien = [Fahrzeug.KRAD];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.kategorien = [Fahrzeug.KRAD, Fahrzeug.FUSS];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.kategorien = [Fahrzeug.RAD, Fahrzeug.FUSS];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.kategorien = [Fahrzeug.RAD];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.kategorien = [Fahrzeug.FUSS];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.kategorien = [];
    result = validationUtils.validateVerkehrsartForm(zaehlung);
    expected = true;
    expect(result).toStrictEqual(expected);
  });
});
