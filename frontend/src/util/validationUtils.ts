import { toNumber } from "lodash";

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

  return {
    pflichtfeld,
    isEmailValid,
    mustBePositivNumber,
  };
}
