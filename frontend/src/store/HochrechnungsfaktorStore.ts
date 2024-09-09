import { defineStore } from "pinia";
import { computed, ref } from "vue";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

export const useHochrechnungsfaktorStore = defineStore(
    "hochrechnungsfaktorStore",
    () => {
        // ref()s become state properties
        const hochrechnungsfaktoren = ref<Array<HochrechnungsfaktorDTO>>([]);
        // computed()s become getters
        const getHochrechnungsfaktoren = computed(
            () => hochrechnungsfaktoren.value
        );
        const getStandardHochrechnungsfaktor = computed(() => {
            let standardFaktor: HochrechnungsfaktorDTO =
                DefaultObjectCreator.createDefaultHochrechnungsfaktor();
            hochrechnungsfaktoren.value.forEach(
                (faktor: HochrechnungsfaktorDTO) => {
                    if (faktor.defaultFaktor) {
                        standardFaktor = faktor;
                    }
                }
            );
            return standardFaktor;
        });
        // function()s become actions
        function setHochrechnungsfaktoren(
            payload: Array<HochrechnungsfaktorDTO>
        ) {
            hochrechnungsfaktoren.value = payload;
        }
        return {
            getHochrechnungsfaktoren,
            getStandardHochrechnungsfaktor,
            setHochrechnungsfaktoren,
        };
    }
);
