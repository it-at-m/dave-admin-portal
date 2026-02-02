import type LaengsverkehrDTO from "@/types/zaehlung/LaengsverkehrDTO";
import type QuerungsverkehrDTO from "@/types/zaehlung/QuerungsverkehrDTO";
import type VerkehrsbeziehungDTO from "@/types/zaehlung/VerkehrsbeziehungDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { cloneDeep, findIndex, isEmpty, toArray, toNumber } from "lodash";

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

  function validateVerkehrForm(zaehlung: ZaehlungDTO): boolean {
    let isValid = true;

    if (zaehlung.zaehlart === Zaehlart.QJS) {
      /**
       * Bei QJS muessen auf mind. einer Straßenseite beide Pfeile aktiv sein.
       */
      const verkehrsbeziehungen = toArray(
        cloneDeep(zaehlung.verkehrsbeziehungen)
      );
      isValid = false;

      // Prüfen ob für die gewählten Verkehrsbeziehungen mindestens eine
      // in selbiger Fahrtrichtung entgegengesetzte Verkehrsbeziehung existiert.
      for (const verkehrsbeziehung of verkehrsbeziehungen) {
        const verkehrsbeziehungOppositeDirection = {} as VerkehrsbeziehungDTO;
        verkehrsbeziehungOppositeDirection.strassenseite =
          verkehrsbeziehung.strassenseite;
        verkehrsbeziehungOppositeDirection.von = verkehrsbeziehung.nach;
        verkehrsbeziehungOppositeDirection.nach = verkehrsbeziehung.von;

        if (!isValid) {
          const indexOfVerkehrsbeziehungInOppositeDirection = findIndex(
            verkehrsbeziehungen,
            function (vb: VerkehrsbeziehungDTO) {
              return (
                vb.von === verkehrsbeziehungOppositeDirection.von &&
                vb.nach === verkehrsbeziehungOppositeDirection.nach &&
                vb.strassenseite ===
                  verkehrsbeziehungOppositeDirection.strassenseite
              );
            }
          );
          // Prüfung ob eine entgegengesetzte Verkehrsbeziehung gefunden wurde.
          isValid = indexOfVerkehrsbeziehungInOppositeDirection >= 0;
        }
      }
    } else if (zaehlung.zaehlart === Zaehlart.FJS) {
      /**
       * Es muss mind. 1 Pfeil pro Knotenarm aktiv sein.
       */
      const laengsverkehre = toArray(cloneDeep(zaehlung.laengsverkehr));
      const laengsverkehreByKnotenarm = new Map<
        number,
        Array<LaengsverkehrDTO>
      >(laengsverkehre.map((laengsverkehr) => [laengsverkehr.knotenarm, []]));

      laengsverkehre.forEach((laengsverkehr) => {
        laengsverkehreByKnotenarm
          .get(laengsverkehr.knotenarm)
          ?.push(laengsverkehr);
      });

      // Prüfung ob je Knotenarm mindestens ein Laengsverkehr gewählt ist.
      laengsverkehreByKnotenarm.forEach((laengsverkehreForKnotenarm) => {
        if (isValid) {
          isValid = laengsverkehreForKnotenarm.length > 0;
        }
      });
    } else if (zaehlung.zaehlart === Zaehlart.QU) {
      /**
       * Es muss mind. 1 Pfeil pro Knotenarm aktiv sein.
       */
      const querungsverkehre = toArray(cloneDeep(zaehlung.querungsverkehr));
      const querungsverkehreByKnotenarm = new Map<
        number,
        Array<QuerungsverkehrDTO>
      >(querungsverkehre.map((laengsverkehr) => [laengsverkehr.knotenarm, []]));

      querungsverkehre.forEach((querungsverkehr) => {
        querungsverkehreByKnotenarm
          .get(querungsverkehr.knotenarm)
          ?.push(querungsverkehr);
      });

      // Prüfung ob je Knotenarm mindestens ein Querungsverkehr gewählt ist.
      querungsverkehreByKnotenarm.forEach((querungsverkehreForKnotenarm) => {
        if (isValid) {
          isValid = querungsverkehreForKnotenarm.length > 0;
        }
      });
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
