import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useZaehlungStore = defineStore("zaehlungStore", () => {
  // ref()s become state properties
  const resetFormevent = ref<boolean>(false);
  // computed()s become getters
  const getResetformevent = computed(() => resetFormevent.value);
  // function()s become actions
  function setResetformevent(payload: boolean) {
    resetFormevent.value = payload;
  }

  return {
    getResetformevent,
    setResetformevent,
  };
});
