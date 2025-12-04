<template>
  <v-sheet
    :height="height"
    :width="width"
    :min-height="minheight"
  >
    <div
      id="minimap"
      ref="minimapRef"
      :style="mapStyle"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import L, { Icon, LatLng } from "leaflet";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import markerIconDiamondRed from "@/assets/cards-diamond-red.png";
import markerIconRed from "@/assets/marker-icon-red.png";

interface Props {
  coords: LatLng;
  height?: string;
  width?: string;
  minheight?: string;
  isMessstelle?: boolean;
  resetMarker?: boolean;
  draggable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "100%",
  width: "100%",
  minheight: "160px",
  isMessstelle: false,
  resetMarker: false,
  draggable: true,
});

const emit = defineEmits<(e: "updateZaehlstellenCoords", v: LatLng) => void>();

const mapAttributionLhm =
  '&copy; <a href="https://stadt.muenchen.de/infos/geobasisdaten.html" style="color: #c62828">GeodatenService München</a>';
const mapAttributionOpenStreetMap =
  '&copy; <a href="https://www.openstreetmap.org/copyright" style="color: #c62828">OpenStreetMap</a>';

const minimapRef = ref<HTMLDivElement | null>(null);

let minimap: L.Map;
const marker = ref(createMarker());

watch(
  () => props.resetMarker,
  () => {
    marker.value.removeFrom(minimap);
    marker.value = createMarker();
    marker.value.addTo(minimap);
    minimap.setView(props.coords, 18);
  }
);

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  minimap.remove();
});

function initMap(): void {
  minimap = L.map(minimapRef.value as HTMLElement, {
    minZoom: 10,
    maxZoom: 18,
    zoom: 18,
    preferCanvas: false,
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: "topleft",
    },
    center: props.coords,
  });

  minimap.whenReady(() => {
    setTimeout(() => {
      minimap.invalidateSize();
      minimap.addControl(
        L.control.attribution({
          position: "bottomleft",
          prefix: "Leaflet",
        })
      );
      createLayersAndAddToMap();
      marker.value.addTo(minimap);
    }, 10);
  });
}

function createLayersAndAddToMap(): void {
  const baseLayers = createBaseLayers();
  const overlayLayers = createOverlayLayers();
  baseLayers.Stadtkarte.addTo(minimap);
  L.control.layers(baseLayers, overlayLayers).addTo(minimap);
}

function createBaseLayers(): L.Control.LayersObject {
  const stadtkarteGesamt = L.tileLayer.wms(
    "https://geoportal.muenchen.de/geoserver/gsm/wms?",
    {
      layers: "gsm:g_stadtkarte_gesamt",
      className: "Stadtkarte",
      attribution: mapAttributionLhm,
    }
  );

  const luftbild = L.tileLayer.wms(
    "https://geoportal.muenchen.de/geoserver/gsm/wms?",
    {
      layers: "gsm:g_luftbild",
      className: "Luftbild",
      attribution: mapAttributionLhm,
    }
  );

  const osm = L.tileLayer.wms(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: mapAttributionOpenStreetMap,
    }
  );

  return {
    Stadtkarte: stadtkarteGesamt,
    Luftbild: luftbild,
    OpenStreetMaps: osm,
  };
}

function createOverlayLayers(): L.Control.LayersObject {
  const stadtbezirke = L.tileLayer.wms(
    "https://geoportal.muenchen.de/geoserver/gsm/wms?",
    {
      layers: "gsm:stadtbezirk",
      className: "Stadtbezirke",
      transparent: true,
      format: "image/png",
      attribution: mapAttributionLhm,
    }
  );
  const stadtviertel = L.tileLayer.wms(
    "https://geoportal.muenchen.de/geoserver/gsm/wms?",
    {
      layers: "gsm:vablock_viertel_dave",
      className: "Stadtviertel",
      transparent: true,
      format: "image/png",
      attribution: mapAttributionLhm,
    }
  );

  return {
    Stadtbezirke: stadtbezirke,
    Stadtviertel: stadtviertel,
  };
}

function createMarker(): L.Marker {
  const defaultIcon = new Icon.Default();
  if (props.isMessstelle) {
    defaultIcon.options.iconUrl = markerIconDiamondRed;
  } else {
    defaultIcon.options.iconUrl = markerIconRed;
  }

  const marker = L.marker(props.coords, {
    icon: defaultIcon,
    opacity: 1.0,
    draggable: props.draggable,
  });

  marker.on("dragend", () => {
    emit("updateZaehlstellenCoords", marker.getLatLng());
  });

  return marker;
}

const mapStyle = computed(() => {
  return `height: ${props.height}; width: ${props.width}; min-height: ${props.minheight}; z-index: 1`;
});
</script>

<style lang="css">
/* Zoom-Buttons verwenden per Default die Farbe 'primary'. Da diese im Button kaum zu erkennen ist,
wurden die Farbe auf schwarz gesetzt */
.leaflet-control-zoom a.leaflet-control-zoom-in {
  color: black;
}

.leaflet-control-zoom a.leaflet-control-zoom-out {
  color: black;
}
</style>
