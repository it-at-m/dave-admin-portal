<template>
  <v-sheet
    width="100%"
    :height="props.height"
    :min-height="props.minheight"
    color="transparent"
    class="pa-4"
    @click="editZaehlstelle"
  >
    <span class="text-caption">Zählstelle</span><br />
    <span class="text-h5">{{ props.nummer }}</span
    ><br /><br />
    <div class="text-caption text-truncate">{{ props.kreuzungsname }}</div>
    <span class="text-caption">Stadtbezirk{{ stadtbezirkInfo }} </span>
  </v-sheet>
</template>
<script setup lang="ts">
import { computed } from "vue";

import { useStadtbezirkStore } from "@/store/StadtbezirkStore";

interface Props {
  height: string;
  minheight: string;
  nummer?: string;
  kreuzungsname?: string;
  stadtbezirkNummer: number | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  minheight: "160px",
  nummer: "",
  kreuzungsname: "",
});

const stadtbezirkStore = useStadtbezirkStore();
const stadtbezirkInfo = computed(() => {
  const stadtbezirkName = stadtbezirkStore.getStadtbezirkName(
    props.stadtbezirkNummer
  );
  return props.stadtbezirkNummer !== undefined
    ? ` ${props.stadtbezirkNummer} ${stadtbezirkName || ""}`
    : ": keine Angabe";
});

const emits = defineEmits<{
  (e: "edit-zaehlstelle"): void;
}>();

function editZaehlstelle() {
  emits("edit-zaehlstelle");
}
</script>
