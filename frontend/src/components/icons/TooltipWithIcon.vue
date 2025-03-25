<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-icon
        v-if="!small"
        class="mr-1"
        :color="color"
        v-bind="attrs"
        v-on="on"
        >{{ icon }}
      </v-icon>
      <v-icon
        v-if="small"
        class="mr-1"
        :color="color"
        small
        v-bind="attrs"
        v-on="on"
        >{{ icon }}
      </v-icon>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>
<script setup lang="ts">
interface Props {
  color?: string;
  icon: string;
  tooltip: string;
  small?: boolean;
}

withDefaults(defineProps<Props>(), {
  color: "black",
  small: false,
});
</script>
