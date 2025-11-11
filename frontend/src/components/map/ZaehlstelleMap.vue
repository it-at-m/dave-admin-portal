<template>
  <v-sheet
    :height="height"
    :min-height="minheight"
    :width="width"
  >
    <div
      id="map"
      ref="mapRef"
      :style="{
        zIndex: 1,
        cursor: customCursor,
        width: '100%',
        height: '100%',
      }"
    />

    <v-speed-dial
      v-if="showSpeedDial"
      v-model="speedDialOpen"
      persistent
      location="top"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          key="speedDial"
          v-tooltip:start="speedDialTooltip"
          color="secondary"
          :icon="speedDialIcon"
          size="large"
          elevation="6"
          location="bottom end"
          position="absolute"
          class="mr-4 mb-4"
          density="default"
          style="z-index: 400"
          :data-x="activatorProps"
          @click="addZaehlstellenMarker"
        />
      </template>
      <v-btn
        key="createZaehlstelle"
        v-tooltip:start="'Bestätigen'"
        icon="mdi-check"
        size="small"
        color="green"
        density="default"
        :disabled="!hasNewMarker"
        @click="createZaehlstelle"
      />
      <v-btn
        key="deleteNewMarker"
        v-tooltip:start="'Entfernen'"
        icon="mdi-delete"
        size="small"
        color="red"
        density="default"
        :disabled="!hasNewMarker"
        @click="deleteNewMarker"
      />
    </v-speed-dial>

    <create-zaehlstelle-dialog
      :show-dialog="showCreateZaehlstelleDialog"
      :coords="newCoords"
      @saved="reloadDataAndCloseDialog"
      @cancel="cancelCreateZaehlstelleDialog"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import type BackendIdDTO from "@/types/common/BackendIdDTO";
import type AnzeigeKarteDTO from "@/types/karte/AnzeigeKarteDTO";
import type MessstelleKarteDTO from "@/types/karte/MessstelleKarteDTO";
import type TooltipMessstelleDTO from "@/types/karte/TooltipMessstelleDTO";
import type TooltipZaehlstelleDTO from "@/types/karte/TooltipZaehlstelleDTO";
import type ZaehlstelleKarteDTO from "@/types/karte/ZaehlstelleKarteDTO";
import type { LeafletMouseEvent } from "leaflet";

import L, { Icon, LatLng, latLng, Marker } from "leaflet";
import { cloneDeep } from "lodash";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import SucheService from "@/api/service/SucheService";
import markerIconDiamondOrange from "@/assets/cards-diamond-orange.png";
import markerIconDiamondRed from "@/assets/cards-diamond-red.png";
import markerIconDiamondShadow from "@/assets/cards-diamond-shadow.png";
import markerIconDiamondViolet from "@/assets/cards-diamond-violet.png";
import markerIconRed from "@/assets/marker-icon-red.png";
import CreateZaehlstelleDialog from "@/components/zaehlstelle/CreateZaehlstelleDialog.vue";
import { useEventbus } from "@/store/Eventbus";
import { useMapConfigStore } from "@/store/MapConfigStore";
import { useMapOptionsStore } from "@/store/MapOptionsStore";
import { useSearchStore } from "@/store/SearchStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import MessstelleStatus from "@/types/enum/MessstelleStatus";
import { useDateUtils } from "@/util/DateUtils";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const mapAttributionLhm =
  '&copy; <a href="https://stadt.muenchen.de/infos/geobasisdaten.html" style="color: #c62828">GeodatenService München</a>';
const mapAttributionOpenStreetMap =
  '&copy; <a href="https://www.openstreetmap.org/copyright" style="color: #c62828">OpenStreetMap</a>';

interface Props {
  minheight?: string;
  zId?: string;
  latlng?: Array<string>;
  height?: string;
  width?: string;
  showMarker?: boolean;
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  minheight: "160px",
  height: "15vh",
  width: "100%",
  showMarker: false,
  zoom: 12,
  zId: "",
  latlng: undefined,
});

const searchStore = useSearchStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();
const dateUtils = useDateUtils();
const mapOptionsStore = useMapOptionsStore();
const mapConfigStore = useMapConfigStore();
const eventbus = useEventbus();

const mapRef = ref<HTMLDivElement | null>(null);

let map: L.Map;
let mapMarkerClusterGroup = L.markerClusterGroup();
const zaehlartenLayer = L.layerGroup();

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  map.remove();
});

function initMap(): void {
  map = L.map(mapRef.value as HTMLElement, {
    zoom: zoomValue.value,
    minZoom: 8,
    maxZoom: 18,
    preferCanvas: false,
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: "topleft",
    },
    center: center.value,
  });
  map.whenReady(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.addControl(
        L.control.attribution({
          position: "bottomleft",
          prefix: "Leaflet",
        })
      );
      map.setZoom(zoomValue.value);
      createLayersAndAddToMap();
      mapMarkerClusterGroup.addTo(map);
      searchErhebungsstelle();
      map.on("click", (e) => {
        mouseUp(e);
      });
    }, 10);
  });
}

const zoomValue = computed(() => {
  if (props.latlng && props.latlng.length > 0) {
    return props.zoom;
  } else if (
    mapOptionsStore.getMapOptions &&
    mapOptionsStore.getMapOptions.zoom
  ) {
    return mapOptionsStore.getMapOptions.zoom;
  } else {
    return props.zoom;
  }
});

const showSpeedDial = computed(() => {
  return !(props.latlng !== undefined && props.latlng.length === 2);
});

const newMarker = ref<Marker | null>(null);
const speedDialOpen = ref(false);
const fab = ref(false);
const fab2 = ref(false);
const addMarker = ref(false);
const useCustomCursor = ref(false);
const showCreateZaehlstelleDialog = ref(false);
// Schalter zum Wechseln der Buttons
const hasNewMarker = computed(() => {
  return newMarker.value !== null;
});
const speedDialIcon = computed(() => {
  let icon = "mdi-map-marker-plus-outline";
  if (addMarker.value) {
    icon = "mdi-map-marker-off-outline";
  }
  return icon;
});
const speedDialTooltip = computed(() => {
  let icon = "Neue Zählstelle anlegen";
  if (addMarker.value) {
    icon = "Anlegen abbrechen";
  }
  return icon;
});
const customCursor = computed(() => {
  if (useCustomCursor.value) {
    return `url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='24' height='24' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z'/%3E %3C/svg%3E") 12 12,auto`;
  } else {
    return "auto";
  }
});
const newCoords = computed(() => {
  if (hasNewMarker.value && newMarker.value) {
    // Da wir gerade auf 'null' überprüft haben können wir dem Compiler mit '!' mitteilen, dass newMarker auf jeden Fall gesetzt ist
    return newMarker.value.getLatLng();
  } else {
    return DefaultObjectCreator.createCenterOfMunichLatLng();
  }
});

function addZaehlstellenMarker() {
  addMarker.value = !addMarker.value;
  useCustomCursor.value = !useCustomCursor.value;
  deleteNewMarker();
}

// Klick-Event zum anlegen eines neuen Markers auf der Karte
function mouseUp(event: LeafletMouseEvent) {
  if (addMarker.value && !newMarker.value) {
    useCustomCursor.value = false;
    createMarkerForNewZaehlstelle(event.latlng);
  }
}

// Legt einen neuen Marker an der Position coords an
// und fügt diesen der Karte hinzu
function createMarkerForNewZaehlstelle(coords: LatLng) {
  newMarker.value = createNewMarker(coords);
  newMarker.value.addTo(map);
}

// Erzeugt einen neuen roten Marker auf der Karte
function createNewMarker(coords: LatLng): Marker {
  const defaultIcon = new Icon.Default();
  defaultIcon.options.iconUrl = markerIconRed;
  return new Marker(coords, {
    icon: defaultIcon,
    opacity: 1.0,
    draggable: true,
  });
}

// Klick-Event zum Oeffnen des ZaehlstelleCreateDialog
function createZaehlstelle() {
  if (newMarker.value) {
    showCreateZaehlstelleDialog.value = true;
  } else {
    // Fehler Toast, dass kein Marker vorhanden
    snackbarStore.showWarning(
      "Es wurde keine neue Zählstelle auf der Karte markiert."
    );
  }
}

// Wenn ein neuer Marker existiert wird dieser gelöscht
// und der Anlegen-Modus wird verlassen
function deleteNewMarker() {
  if (newMarker.value) {
    newMarker.value.removeFrom(map);
    newMarker.value = null;
    resetBooleans();
  }
}

function resetBooleans() {
  fab.value = false;
  fab2.value = false;
  addMarker.value = false;
  useCustomCursor.value = false;
}

function reloadDataAndCloseDialog(backendIdDTO: BackendIdDTO) {
  resetBooleans();
  closeDialog();
  routeToZaehlstelle(backendIdDTO.id);
}

function cancelCreateZaehlstelleDialog() {
  deleteNewMarker();
  resetBooleans();
  closeDialog();
}

function closeDialog() {
  showCreateZaehlstelleDialog.value = false;
}

/**
 * Die Methode setzt Koordinate auf welche Zentriert werden soll.
 */
const center = computed<LatLng>(() => {
  if (props.latlng && props.latlng.length > 0) {
    return createLatLngFromString(props.latlng[0], props.latlng[1]);
  } else if (
    mapOptionsStore.getMapOptions &&
    mapOptionsStore.getMapOptions.latitude &&
    mapOptionsStore.getMapOptions.longitude
  ) {
    return createLatLngFromString(
      mapOptionsStore.getMapOptions.latitude,
      mapOptionsStore.getMapOptions.longitude
    );
  } else {
    return createLatLngFromString(
      mapConfigStore.getMapConfig.lat,
      mapConfigStore.getMapConfig.lng
    );
  }
});

function createLatLngFromString(lat: string, lng: string): LatLng {
  return latLng(parseFloat(lat), parseFloat(lng));
}

function createLayersAndAddToMap(): void {
  const baseLayers = createBaseLayers();
  const overlayLayers = createOverlayLayers();

  baseLayers.Stadtkarte.addTo(map);
  L.control.layers(baseLayers, overlayLayers).addTo(map);
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
    OpenStreetMap: osm,
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
  const lichtsignalanlagen = L.tileLayer.wms(
    "https://geoportal.muenchen.de/geoserver/kvr/wms?",
    {
      layers: "kvr:lsa_dave",
      className: "Lichtsignalanlagen",
      transparent: true,
      format: "image/png",
      attribution: mapAttributionLhm,
    }
  );

  return {
    Stadtbezirke: stadtbezirke,
    Stadtviertel: stadtviertel,
    Lichtsignalanlagen: lichtsignalanlagen,
  };
}

const searchResult = computed(() => {
  return searchStore.getSearchResult;
});

watch(searchResult, () => {
  resetMarker();
});

watch(
  () => [eventbus.getReloadEvent, props.latlng],
  ([newA, newB], [prevA, prevB]) => {
    if (newA !== prevA && newB !== prevB) {
      searchErhebungsstelle();
    }
  }
);

function resetMarker(): void {
  mapMarkerClusterGroup.removeFrom(map);
  mapMarkerClusterGroup.clearLayers();
  zaehlartenLayer.removeFrom(map);
  setMarkerToMap();
}

function setMarkerToMap() {
  mapMarkerClusterGroup.clearLayers();
  mapMarkerClusterGroup = L.markerClusterGroup({
    disableClusteringAtZoom: 15,
    spiderfyOnMaxZoom: false,
    chunkedLoading: true,
  });
  const erhebungsstellenKarte: Array<AnzeigeKarteDTO> = searchResult.value;
  const markers: Array<Marker> = [];
  erhebungsstellenKarte.forEach((erhebungsstelleKarte) => {
    if (erhebungsstelleKarte.type != "messstelle") {
      markers.push(
        createMarkerForZaehlstelle(erhebungsstelleKarte as ZaehlstelleKarteDTO)
      );
    } else {
      markers.push(
        createMarkerForMessstelle(erhebungsstelleKarte as MessstelleKarteDTO)
      );
    }
  });

  mapMarkerClusterGroup.addLayers(markers);
  mapMarkerClusterGroup.addTo(map);
  if (erhebungsstellenKarte.length === 1) {
    /**
     * Falls in der Main.view nach einer bestimmten Zaehlstelle gesucht
     * und diese Suche mit Druck auf die Enter-Taste eingeleitet wird,
     * umfasst das Suchergebnis somit nur eine Zaehlstelle.
     * Auf diese eine mit einem Icon angezeigte Zaehlstelle muss dann zentriert werden.
     */
    map.setView(createLatLng(erhebungsstellenKarte[0]), 18);
  } else if (props.zId && props.latlng && props.latlng.length > 0) {
    // Zaehlartenmarker erzeugen
    map.setView(center.value, zoomValue.value);
  } else {
    map.setView(center.value, zoomValue.value);
  }
}

function searchErhebungsstelle() {
  SucheService.searchErhebungsstelle(
    searchStore.getLastSearchQuery,
    searchStore.getSearchAndFilterOptions
  )
    .then((result) => {
      searchStore.setSearchResult(cloneDeep(result));
    })
    .catch((error) => {
      snackbarStore.showApiError(error);
    })
    .finally(() => {
      setMarkerToMap();
    });
}

function saveMapPosition() {
  const mapCenter = map.getBounds().getCenter();

  const lat = mapCenter?.lat.toString();
  const lng = mapCenter?.lng.toString();
  const zoom = map.getZoom();

  mapOptionsStore.setMapOptions({
    longitude: lng,
    latitude: lat,
    zoom: zoom,
  });
}

function routeToZaehlstelle(id: string) {
  saveMapPosition();
  router.push("/zaehlstelle/" + id);
}

function routeToMessstelle(id: string) {
  saveMapPosition();
  router.push(`/messstelle/${id}`);
}

function createLatLng(anzeigeKarte: AnzeigeKarteDTO): LatLng {
  return latLng(anzeigeKarte.latitude, anzeigeKarte.longitude);
}

function createMarkerForZaehlstelle(
  zaehlstelleKarte: ZaehlstelleKarteDTO
): Marker {
  const marker: Marker = new Marker(
    createLatLng(zaehlstelleKarte),
    markerOptionsZaehlstelle(zaehlstelleKarte)
  );
  marker.bindTooltip(createTooltipZaehlstelle(zaehlstelleKarte.tooltip), {
    direction: "top",
    offset: [-14, 0],
  });

  marker.on("click", () => {
    // Zeige alle Zaehlungen zur Zaehlstelle an.
    routeToZaehlstelle(zaehlstelleKarte.id);
  });
  return marker;
}

function createMarkerForMessstelle(
  messstelleKarteDto: MessstelleKarteDTO
): Marker {
  const marker: Marker = new Marker(
    createLatLng(messstelleKarteDto),
    markerOptionsMessstelle(messstelleKarteDto)
  );
  marker.bindTooltip(createTooltipMessstelle(messstelleKarteDto.tooltip), {
    direction: "top",
    offset: [0, -25],
  });
  marker.on("click", () => {
    routeToMessstelle(messstelleKarteDto.id);
  });
  return marker;
}

/**
 * Tooltip wird zur Anzeige von Metainformationen über die Zählstelle benötigt.
 * Ein Tooltip enthält (wenn vorhanden) folgende Informationne:
 *  - Zählstellennumer
 *  - Kreuzungsname
 *  - Stadtbezirk
 *  - Stadtbezirksnummer
 *  - anzahlZaehlungen
 *  - datumLetzteZaehlung
 */
function createTooltipZaehlstelle(tooltipDto: TooltipZaehlstelleDTO): string {
  if (!tooltipDto) {
    return "<div></div>";
  }
  let tooltip = "<div><b>";
  if (tooltipDto.zaehlstellennnummer) {
    tooltip = `${tooltip}Zählstelle: ${tooltipDto.zaehlstellennnummer}</b><br/>`;
  }
  if (tooltipDto.kreuzungsname) {
    tooltip = `${tooltip}${tooltipDto.kreuzungsname}<br/>`;
  }
  if (!tooltipDto.zaehlstellennnummer) {
    tooltip = `${tooltip}</b>`;
  }
  tooltip = `${tooltip}<br/>`;
  if (!tooltipDto.stadtbezirk) {
    tooltip = `${tooltip}Stadtbezirk: Keine Angabe<br/>`;
  } else {
    tooltip = `${tooltip}Stadtbezirk: `;
    if (tooltipDto.stadtbezirknummer) {
      tooltip = `${tooltip}${tooltipDto.stadtbezirknummer} - `;
    }
    tooltip = `${tooltip}${tooltipDto.stadtbezirk}<br/>`;
  }
  if (tooltipDto.anzahlZaehlungen) {
    tooltip = `${tooltip}Anzahl der Zählungen: ${tooltipDto.anzahlZaehlungen}<br/>`;
    if (tooltipDto.datumLetzteZaehlung) {
      tooltip = `${tooltip}Letzte Zählung: ${tooltipDto.datumLetzteZaehlung}<br/>`;
    }
  } else {
    tooltip = `${tooltip}Noch keine Zählungen vorhanden.`;
  }
  tooltip = `${tooltip}</div>`;
  return tooltip;
}

function createTooltipMessstelle(tooltipDto: TooltipMessstelleDTO): string {
  if (!tooltipDto) {
    return "<div></div>";
  }
  let tooltip = "<div>";
  if (tooltipDto.mstId) {
    tooltip = `<b>${tooltip}Messstelle: ${tooltipDto.mstId}`;
    if (tooltipDto.detektierteVerkehrsart) {
      tooltip = `${tooltip} (${tooltipDto.detektierteVerkehrsart})`;
    }
    tooltip = `${tooltip}</b><br/>`;
  }
  if (tooltipDto.standort) {
    tooltip = `${tooltip}${tooltipDto.standort}<br/>`;
  }
  tooltip = `${tooltip}<br/>`;
  if (!tooltipDto.stadtbezirk) {
    tooltip = `${tooltip}Stadtbezirk: Keine Angabe<br/>`;
  } else {
    tooltip = `${tooltip}Stadtbezirk: `;
    if (tooltipDto.stadtbezirknummer) {
      tooltip = `${tooltip}${tooltipDto.stadtbezirknummer} - `;
    }
    tooltip = `${tooltip}${tooltipDto.stadtbezirk}<br/>`;
  }
  tooltip = `${tooltip} Aufbau: `;
  if (tooltipDto.realisierungsdatum) {
    tooltip = `${tooltip}${dateUtils.formatDate(
      tooltipDto.realisierungsdatum
    )}`;
  }
  tooltip = `${tooltip}<br/>`;
  if (tooltipDto.abbaudatum) {
    tooltip = `${tooltip}Abbau: ${dateUtils.formatDate(
      tooltipDto.abbaudatum
    )}<br/>`;
  }
  if (tooltipDto.datumLetztePlausibleMessung) {
    tooltip = `${tooltip}Letzte plausible Messung: ${dateUtils.formatDate(
      tooltipDto.datumLetztePlausibleMessung
    )}<br/>`;
  }

  tooltip = `${tooltip}</div>`;
  return tooltip;
}

/**
 * Setzt die Optionen bezüglich verwendetes Icon für den Zaehlstellenmarker.
 */
function markerOptionsZaehlstelle(zaehlstelleKarte: ZaehlstelleKarteDTO) {
  if (props.zId) {
    if (props.zId === zaehlstelleKarte.id) {
      const defaultIcon = new Icon.Default();
      defaultIcon.options.iconUrl = markerIconRed;
      return { opacity: 1.0, icon: defaultIcon };
    } else {
      return { opacity: 0.5 };
    }
  }
}

/**
 * Setzt die Optionen bezüglich verwendetes Icon für den Messstellenmarker.
 */
function markerOptionsMessstelle(messstelleKarte: MessstelleKarteDTO) {
  const isMessstelleInPlanung =
    messstelleKarte.status === MessstelleStatus.IN_PLANUNG;
  const defaultIcon = new Icon({
    iconUrl: isMessstelleInPlanung
      ? markerIconDiamondOrange
      : markerIconDiamondViolet,
    shadowUrl: markerIconDiamondShadow,
    shadowAnchor: [8, 45],
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (props.zId) {
    if (props.zId === messstelleKarte.id) {
      defaultIcon.options.iconUrl = markerIconDiamondRed;
      return { opacity: 1.0, icon: defaultIcon };
    } else {
      return { opacity: 0.5, icon: defaultIcon };
    }
  } else {
    return { opacity: 1.0, icon: defaultIcon };
  }
}
</script>

<style lang="css" scoped>
/* Zoom-Buttons verwenden per Default die Farbe 'primary'. Da diese im Button kaum zu erkennen ist,
wurden die Farbe auf schwarz gesetzt */
.leaflet-control-zoom a.leaflet-control-zoom-in {
  color: black;
}

.leaflet-control-zoom a.leaflet-control-zoom-out {
  color: black;
}
</style>
