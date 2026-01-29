import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { isEmpty, toNumber } from "lodash";

import Fahrzeug from "@/types/enum/Fahrzeug";
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

  function validateVerkehrsartForm(zaehlung: ZaehlungDTO): boolean {
    let isValid = true;
    if (
      zaehlung.zaehlart === Zaehlart.QJS ||
      zaehlung.zaehlart === Zaehlart.QU ||
      zaehlung.zaehlart === Zaehlart.FJS
    ) {
      // Es darf nur Rad und/oder Fuss ausgewaehlt sein
      isValid = isEmpty(
        zaehlung.kategorien.filter(
          (value) => value !== Fahrzeug.FUSS && value !== Fahrzeug.RAD
        )
      );
    }
    return isValid;
  }

  return {
    pflichtfeld,
    isEmailValid,
    mustBePositivNumber,
    validateKnotenLageForm,
    validateVerkehrsartForm,
  };
}
