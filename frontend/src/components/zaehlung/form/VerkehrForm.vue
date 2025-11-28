<template>
  <verkehrsbeziehung-kreisverkehr-form
    v-if="zaehlung.kreisverkehr"
    v-model="zaehlung"
    :height="height"
  />
  <knotenverkehr-form
    v-else-if="
      zaehlung.zaehlart === Zaehlart.FJS || zaehlung.zaehlart === Zaehlart.QU
    "
    v-model:zaehlung="zaehlung"
    v-model:is-valid="isValid"
    :height="height"
  />
  <querschnitt-je-strassenseite-form
    v-else-if="zaehlung.zaehlart === Zaehlart.QJS"
    v-model:zaehlung="zaehlung"
    v-model:is-valid="isValid"
    :height="height"
  />
  <verkehrsbeziehung-kreuzung-form
    v-else
    v-model="zaehlung"
    :height="height"
  />
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import KnotenverkehrForm from "@/components/zaehlung/form/KnotenverkehrForm.vue";
import QuerschnittJeStrassenseiteForm from "@/components/zaehlung/form/QuerschnittJeStrassenseiteForm.vue";
import VerkehrsbeziehungKreisverkehrForm from "@/components/zaehlung/form/VerkehrsbeziehungKreisverkehrForm.vue";
import VerkehrsbeziehungKreuzungForm from "@/components/zaehlung/form/VerkehrsbeziehungKreuzungForm.vue";
import Zaehlart from "@/types/enum/Zaehlart";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});
const isValid = defineModel<boolean>("isValid", {
  required: true,
});
</script>
