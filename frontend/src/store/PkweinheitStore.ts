import type PkwEinheit from "@/types/common/PkwEinheit";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePkweinheitStore = defineStore("pkweinheitStore", () => {
  // ref()s become state properties
  const pkwEinheit = ref<PkwEinheit>({} as PkwEinheit);
  // computed()s become getters
  const getPkwEinheit = computed(() => pkwEinheit.value);
  // function()s become actions
  function setPkwEinheit(payload: PkwEinheit) {
    pkwEinheit.value = payload;
  }

  return {
    getPkwEinheit,
    setPkwEinheit,
  };
});
