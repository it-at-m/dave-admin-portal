import type { GebietseinheitenDTO } from "@/api/client";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

import DefaultObjectCreator from "@/util/DefaultObjectCreator";

export const useStadtbezirkStore = defineStore("stadtbezirkStore", () => {
  const gebietseinheiten = ref<GebietseinheitenDTO>(
    DefaultObjectCreator.createDefaultGebietseinheitenDTO()
  );

  const getStadtbezirke = computed(() => gebietseinheiten.value.stadtbezirke);

  const getStadtbezirksviertel = computed(
    () => gebietseinheiten.value.stadtbezirksviertel
  );

  function getStadtbezirkName(nummer: number | undefined): string | undefined {
    if (nummer === undefined) return undefined;

    return gebietseinheiten.value.stadtbezirke.find(
      (stadtbezirk) => stadtbezirk.nummer.toString() === nummer.toString()
    )?.name;
  }

  function setGebietseinheiten(payload: GebietseinheitenDTO) {
    gebietseinheiten.value = payload;
  }

  return {
    getStadtbezirke,
    getStadtbezirksviertel,
    getStadtbezirkName,
    setGebietseinheiten,
  };
});
