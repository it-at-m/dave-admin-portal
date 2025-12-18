import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";

import { describe, expect, it } from "vitest";

import Zaehlart from "@/types/enum/Zaehlart";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { useValidationUtils } from "@/util/ValidationUtils";

describe("ValidationUtils.ts", () => {
  it("validateVerkehrForm", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();
    let selectedKnotenarme: Array<string> = [];
    let result = validationUtils.validateVerkehrForm(
      zaehlung,
      selectedKnotenarme
    );
    let expected = true;
    expect(result).toStrictEqual(expected);

    // Fall !QJS && !FJS && !QU
    zaehlung.zaehlart = Zaehlart.N;
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.N;
    selectedKnotenarme = ["1"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    // Fall QJS
    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["2"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["3"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "3"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "2"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["3", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "2", "3"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "2", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["2", "3", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "3", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QJS;
    selectedKnotenarme = ["1", "2", "3", "4"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    // Fall FJS || QU
    const knotenarm1 = {} as KnotenarmDTO;
    knotenarm1.nummer = 1;
    const knotenarm2 = {} as KnotenarmDTO;
    knotenarm2.nummer = 2;

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    selectedKnotenarme = ["1RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    selectedKnotenarme = ["1RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["2LD"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["2LD"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD", "2RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD", "2RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = false;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    selectedKnotenarme = [];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD", "1RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1];
    selectedKnotenarme = ["1LD", "1RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [knotenarm1, knotenarm2];
    selectedKnotenarme = ["1LD", "1LU", "2RU"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [knotenarm1, knotenarm2];
    selectedKnotenarme = ["1LD", "2RU", "2LD"];
    result = validationUtils.validateVerkehrForm(zaehlung, selectedKnotenarme);
    expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateKnotenLageForm", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    // Fall QJS
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
});
