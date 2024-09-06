import { defineStore } from "pinia";
import { computed, ref } from "vue";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";

export const useSearchStore = defineStore("searchStore", () => {
    // ref()s become state properties
    const searchResult = ref<Array<AnzeigeKarteDTO>>([]);
    const lastSearchQuery = ref<string>("");
    // computed()s become getters
    const getSearchResult = computed(() => searchResult.value);
    const getLastSearchQuery = computed(() => lastSearchQuery.value);
    // function()s become actions
    function setSearchResult(payload: Array<AnzeigeKarteDTO>) {
        searchResult.value = payload;
    }
    function setLastSearchQuery(payload: string) {
        lastSearchQuery.value = payload;
    }

    return {
        getSearchResult,
        getLastSearchQuery,
        setSearchResult,
        setLastSearchQuery,
    };
});
