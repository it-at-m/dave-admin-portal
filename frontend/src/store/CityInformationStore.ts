import { defineStore } from "pinia";

import type CityDistrictDTO from "@/types/configuration/CityDistrictDTO";
import type KeyVal from "@/types/common/KeyVal";
import { stadtbezirksviertel } from "@/types/enum/Stadtbezirksviertel";

export const useCityInformationStore = defineStore("cityInformationStore", () => {
  let cityDistricts = Array<CityDistrictDTO>();
  const stadtbezirke2 = Array<KeyVal>();
  const StadtbezirkToBeschreibung2 = new Map<number, string>();

  function setCityDistricts(payload: Array<CityDistrictDTO>) {
    cityDistricts = payload;
    for(const district of cityDistricts) {
      stadtbezirke2.push({value: district.number.toString(), title: district.number + " " + district.name})
      StadtbezirkToBeschreibung2.set(district.number, district.number + " " + district.name)
    }
  }

  function BeschreibungToStadtbezirk2(): Map<number, string> {
    return new Map(
      [...StadtbezirkToBeschreibung2].reverse()
    );
  }

  function getStadtbezirksviertel(districtNumber: number) {
    if (districtNumber >= 100) {
      return stadtbezirksviertel("100");
    } else {
      return stadtbezirksviertel(
        districtNumber
          ? districtNumber.toString()
          : "None"
      );
    }
  }

  return {
    stadtbezirke2,
    StadtbezirkToBeschreibung2,
    BeschreibungToStadtbezirk2,
    cityDistricts,
    setCityDistricts,
    getStadtbezirksviertel
  };
});