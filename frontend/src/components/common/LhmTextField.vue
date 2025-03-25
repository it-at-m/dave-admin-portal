<template>
  <div>
    <span
      v-if="showCaption"
      class="text-caption"
      >{{ caption }}</span
    ><br />
    <span class="text text-info">{{ text }}</span
    ><br /><br v-if="fahrbeziehung" />
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash";
import { computed } from "vue";

interface Props {
  fahrbeziehung?: boolean;
  text?: string;
  caption: string;
}

const props = withDefaults(defineProps<Props>(), {
  fahrbeziehung: false,
});

const showCaption = computed(() => !isEmpty(props.caption));
</script>

<style scoped>
.text-info {
  font-size: 18px;
  color: black;
}
</style>
