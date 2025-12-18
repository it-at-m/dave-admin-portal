import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { difference, isEmpty, toNumber } from "lodash";

import Zaehlart from "@/types/enum/Zaehlart";

export function useValidationUtils() {
  function pflichtfeld(value: string): boolean | string {
    if (value) {
      return true;
    }
    return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
  }

  /* Prüft, ob die Email valide ist. */
  function isEmailValid(email: string): boolean {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  }

  /**
   * Prüft, ob der übergebene Wert eine Zahl ist.
   */
  function mustBePositivNumber(value: string): boolean | string {
    const number = toNumber(value);
    if (isNaN(number) || number <= 0) {
      return "Bitte eine Zählstellennummer >= 0 eingeben";
    }
    return true;
  }

  /**
   * Validiert die VerkehrForm abhaengig von der Zaehlart
   * @param zaehlung zu validierende Zaehlung
   * @param selectedKnotenarme aktuell ausgewaehlte Knotenarme
   */
  function validateVerkehrForm(
    zaehlung: ZaehlungDTO,
    selectedKnotenarme: Array<string>
  ): boolean {
    let validation = true;
    if (zaehlung.zaehlart === Zaehlart.QJS) {
      // Bei QJS muessen auf mind. einer Straßenseite beide Pfeile aktiv sein
      validation =
        (selectedKnotenarme.includes("1") &&
          selectedKnotenarme.includes("2")) ||
        (selectedKnotenarme.includes("3") && selectedKnotenarme.includes("4"));
    } else if (
      zaehlung.zaehlart === Zaehlart.FJS ||
      zaehlung.zaehlart === Zaehlart.QU
    ) {
      // Bei FJS und QU muss mind. 1 Pfeil pro Knotenarm aktiv sein
      const selectedKnotenarmNummernUnique = selectedKnotenarme
        .map((knotenarm: string) => knotenarm.charAt(0))
        .filter((value, index, array) => array.indexOf(value) === index);

      const availableKnotenarme = zaehlung.knotenarme.map(
        (arm) => `${arm.nummer}`
      );
      validation =
        // Alles ausgewaehlten KnotenarmNummern muessen in den verfuegbaren Knotenarmen enthalten sein
        isEmpty(
          difference(availableKnotenarme, selectedKnotenarmNummernUnique)
        ) &&
        // Alles verfuegbaren Knotenarmen muessen in den ausgewaehlten KnotenarmNummern enthalten sein
        isEmpty(
          difference(selectedKnotenarmNummernUnique, availableKnotenarme)
        );
    }
    return validation;
  }

  function validateKnotenLageForm(zaehlung: ZaehlungDTO): boolean {
    let isValid = true;
    if (zaehlung.zaehlart === Zaehlart.QJS) {
      // Erlaubte Kombinationen: 1 & 3, 2 & 4, 5 & 7, 6 & 8
      // => Absolute Subtraktion der Kontenarmnummern muss immer 2 sein
      isValid =
        zaehlung.knotenarme.length === 2 &&
        Math.abs(
          zaehlung.knotenarme[0].nummer - zaehlung.knotenarme[1].nummer
        ) === 2;
    }
    return isValid;
  }

  return {
    pflichtfeld,
    isEmailValid,
    mustBePositivNumber,
    validateVerkehrForm,
    validateKnotenLageForm,
  };
}
