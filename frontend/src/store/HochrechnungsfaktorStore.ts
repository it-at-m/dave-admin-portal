import type Hochrechnungsfaktor from "@/types/config/Hochrechnungsfaktor";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

import DefaultObjectCreator from "@/util/DefaultObjectCreator";

export const useHochrechnungsfaktorStore = defineStore(
  "hochrechnungsfaktorStore",
  () => {
    const hochrechnungsfaktoren = ref<Array<Hochrechnungsfaktor>>([]);
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
      let standardFaktor: Hochrechnungsfaktor =
        DefaultObjectCreator.createDefaultHochrechnungsfaktor();
      hochrechnungsfaktoren.value.forEach((faktor: Hochrechnungsfaktor) => {
        if (faktor.defaultFaktor) {
          standardFaktor = faktor;
        }
      });
      return standardFaktor;
    });
    // function()s become actions
    function setHochrechnungsfaktoren(payload: Array<Hochrechnungsfaktor>) {
      hochrechnungsfaktoren.value = payload;
    }
    return {
      getHochrechnungsfaktorenWithDefaultAtFirstPosition,
      getStandardHochrechnungsfaktor,
      setHochrechnungsfaktoren,
    };
  }
);
