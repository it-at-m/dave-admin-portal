<template>
  <tooltip-with-icon
    :small="small"
    :color="color"
    :icon="icon.iconPath"
    :tooltip="icon.tooltip"
  />
</template>
<script setup lang="ts">
import { computed } from "vue";

import IconTooltip from "@/components/icons/IconTooltip";
import Wetter from "@/domain/enums/Wetter";

interface Props {
  small?: boolean;
  color?: string;
  wetter: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "black",
  small: false,
});

/**
 * Alle Wetter Icons zu den Schlüsseln.
 */
const wetterIcons: Map<string, IconTooltip> = new Map([
  [Wetter.SUNNY, new IconTooltip("mdi-weather-sunny", "Sonnig")],
  [Wetter.SUNNY_COLD, new IconTooltip("mdi-weather-hazy", "Sonnig, kalt")],
  [Wetter.CLOUDY, new IconTooltip("mdi-weather-partly-cloudy", "Bewölkt")],
  [Wetter.RAINY, new IconTooltip("mdi-weather-rainy", "Regnerisch (Schauer)")],
  [
    Wetter.CONTINUOUS_RAINY,
    new IconTooltip("mdi-weather-pouring", "Regnerisch (dauerhaft)"),
  ],
  [Wetter.FOGGY, new IconTooltip("mdi-weather-fog", "Neblig")],
  [Wetter.SNOWY, new IconTooltip("mdi-weather-snowy-heavy", "Schneefall")],
]);

/**
 * Lädt das richtige MDI Icon aus der Liste.
 */
const icon = computed<IconTooltip>(() => {
  let result = wetterIcons.get(props.wetter);
  if (result === undefined) {
    result = new IconTooltip(
      "mdi-cloud-question",
      "Keine Information zum Wetter"
    );
  }
  return result;
});
</script>
