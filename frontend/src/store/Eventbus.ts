import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useEventbus = defineStore("eventbus", () => {
  // ref()s become state properties
  const reloadEvent = ref<boolean>(false);
  // computed()s become getters
  const getReloadEvent = computed(() => reloadEvent.value);
  // function()s become actions
  function setReloadEvent() {
    reloadEvent.value = !reloadEvent.value;
  }

  return {
    getReloadEvent,
    setReloadEvent,
  };
});
