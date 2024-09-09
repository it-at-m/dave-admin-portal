import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePkweinheitStore = defineStore("pkweinheitStore", () => {
    // ref()s become state properties
    const pkwEinheit = ref<PkwEinheitDTO>({} as PkwEinheitDTO);
    // computed()s become getters
    const getPkwEinheit = computed(() => pkwEinheit.value);
    // function()s become actions
    function setPkwEinheit(payload: PkwEinheitDTO) {
        pkwEinheit.value = payload;
    }

    return {
        getPkwEinheit,
        setPkwEinheit,
    };
});
