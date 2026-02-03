import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";
import type LaengsverkehrDTO from "@/types/zaehlung/LaengsverkehrDTO";
import type QuerungsverkehrDTO from "@/types/zaehlung/QuerungsverkehrDTO";
import type VerkehrsbeziehungDTO from "@/types/zaehlung/VerkehrsbeziehungDTO";

import { describe, expect, it } from "vitest";

import Bewegungsrichtung from "@/types/enum/Bewegungsrichtung";
import Fahrzeug from "@/types/enum/Fahrzeug";
import Himmelsrichtung from "@/types/enum/Himmelsrichtung";
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

  it("validateVerkehrFormNotZaehlartQjsFjsQu", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.N;
    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQuKnotenarmOneAndThreeAndAllQuerungenSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 1;
    querungsverkehr.richtung = Himmelsrichtung.W;
    zaehlung.querungsverkehr.push(querungsverkehr);
    querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 1;
    querungsverkehr.richtung = Himmelsrichtung.O;
    zaehlung.querungsverkehr.push(querungsverkehr);
    querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 3;
    querungsverkehr.richtung = Himmelsrichtung.W;
    zaehlung.querungsverkehr.push(querungsverkehr);
    querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 3;
    querungsverkehr.richtung = Himmelsrichtung.O;
    zaehlung.querungsverkehr.push(querungsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQuKnotenarmOneAndThreeAndOneQuerungForEachKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 1;
    querungsverkehr.richtung = Himmelsrichtung.W;
    zaehlung.querungsverkehr.push(querungsverkehr);
    querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 3;
    querungsverkehr.richtung = Himmelsrichtung.O;
    zaehlung.querungsverkehr.push(querungsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQuKnotenarmOneAndThreeAndOneQuerungAtOneKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    const querungsverkehr = {} as QuerungsverkehrDTO;
    querungsverkehr.knotenarm = 1;
    querungsverkehr.richtung = Himmelsrichtung.W;
    zaehlung.querungsverkehr.push(querungsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQuKnotenarmOneAndThreeAndNoQuerungSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QU;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    zaehlung.querungsverkehr = [];

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartFjsKnotenarmOneAndThreeAndEachLaengsverkehrForEachKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.AUS;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.O;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.AUS;
    laengsverkehr.strassenseite = Himmelsrichtung.O;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 3;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 3;
    laengsverkehr.richtung = Bewegungsrichtung.AUS;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 3;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.O;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 3;
    laengsverkehr.richtung = Bewegungsrichtung.AUS;
    laengsverkehr.strassenseite = Himmelsrichtung.O;
    zaehlung.laengsverkehr.push(laengsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartFjsKnotenarmOneAndThreeAndOneLaengsverkehrForEachKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);
    laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 3;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartFjsKnotenarmOneAndThreeAndOneLaengsverkehrForOneKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    const laengsverkehr = {} as LaengsverkehrDTO;
    laengsverkehr.knotenarm = 1;
    laengsverkehr.richtung = Bewegungsrichtung.EIN;
    laengsverkehr.strassenseite = Himmelsrichtung.W;
    zaehlung.laengsverkehr.push(laengsverkehr);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartFjsKnotenarmOneAndThreeAndNoLaengsverkehrSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.FJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    zaehlung.laengsverkehr = [];

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQjsKnotenarmOneAndThreeAndEachVerkehrsbeziehungForEachKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);
    verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 3;
    verkehrsbeziehung.nach = 1;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);
    verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.O;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);
    verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 3;
    verkehrsbeziehung.nach = 1;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.O;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQjsKnotenarmOneAndThreeAndEachVerkehrsbeziehungForOneKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);
    verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 3;
    verkehrsbeziehung.nach = 1;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = true;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQjsKnotenarmOneAndThreeAndOneVerkehrsbeziehungForEachKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    let verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);
    verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.O;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQjsKnotenarmOneAndThreeAndOneVerkehrsbeziehungForOneKnotenarmSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    const verkehrsbeziehung = {} as VerkehrsbeziehungDTO;
    verkehrsbeziehung.von = 1;
    verkehrsbeziehung.nach = 3;
    verkehrsbeziehung.strassenseite = Himmelsrichtung.W;
    zaehlung.verkehrsbeziehungen.push(verkehrsbeziehung);

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });

  it("validateVerkehrFormZaehlartQjsKnotenarmOneAndThreeAndNoVerkehrsbeziehungSelected", () => {
    const validationUtils = useValidationUtils();

    const zaehlung = DefaultObjectCreator.createDefaultZaehlungDTO();

    zaehlung.zaehlart = Zaehlart.QJS;
    zaehlung.knotenarme = [];
    let knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 1;
    zaehlung.knotenarme.push(knotenarm);
    knotenarm = {} as KnotenarmDTO;
    knotenarm.nummer = 3;
    zaehlung.knotenarme.push(knotenarm);

    zaehlung.verkehrsbeziehungen = [];

    const result = validationUtils.validateVerkehrForm(zaehlung);
    const expected = false;
    expect(result).toStrictEqual(expected);
  });
});
