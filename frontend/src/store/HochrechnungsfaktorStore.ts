import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

import DefaultObjectCreator from "@/util/DefaultObjectCreator";

export const useHochrechnungsfaktorStore = defineStore(
  "hochrechnungsfaktorStore",
  () => {
    const hochrechnungsfaktoren = ref<Array<HochrechnungsfaktorDTO>>([]);
    const getHochrechnungsfaktorenWithDefaultAtFirstPosition = computed(() => {
      const defaultFactors = hochrechnungsfaktoren.value.filter(
        (hochrechnungsfaktor) => hochrechnungsfaktor.defaultFaktor
      );
      const nonDefaultFactors = hochrechnungsfaktoren.value.filter(
        (hochrechnungsfaktor) => !hochrechnungsfaktor.defaultFaktor
      );
      return defaultFactors.concat(nonDefaultFactors);
    });
    const getStandardHochrechnungsfaktor = computed(() => {
      let standardFaktor: HochrechnungsfaktorDTO =
        DefaultObjectCreator.createDefaultHochrechnungsfaktor();
      hochrechnungsfaktoren.value.forEach((faktor: HochrechnungsfaktorDTO) => {
        if (faktor.defaultFaktor) {
          standardFaktor = faktor;
        }
      });
      return standardFaktor;
    });
    // function()s become actions
    function setHochrechnungsfaktoren(payload: Array<HochrechnungsfaktorDTO>) {
      hochrechnungsfaktoren.value = payload;
    }
    return {
      getHochrechnungsfaktorenWithDefaultAtFirstPosition,
      getStandardHochrechnungsfaktor,
      setHochrechnungsfaktoren,
    };
  }
);
