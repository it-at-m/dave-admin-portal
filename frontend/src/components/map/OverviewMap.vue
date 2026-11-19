<template>
  <v-sheet
    :height="height"
    :min-height="minHeight"
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
        @click="deleteNewMarkerIfExists"
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
import { useLeafletMap } from "@/composables/useLeafletMap";
import { useConfigurationStore } from "@/store/ConfigurationStore";
import { useEventbus } from "@/store/Eventbus";
import { useMapOptionsStore } from "@/store/MapOptionsStore";
import { useSearchStore } from "@/store/SearchStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import MessstelleStatus from "@/types/enum/MessstelleStatus";
import { useDateUtils } from "@/util/DateUtils";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
  minHeight?: string;
  zaehlstelleId?: string;
  center?: LatLng;
  height?: string;
  width?: string;
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: "160px",
  zaehlstelleId: "",
  center: undefined,
  height: "15vh",
  width: "100%",
  zoom: 12,
});

const searchStore = useSearchStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();
const dateUtils = useDateUtils();
const mapOptionsStore = useMapOptionsStore();
const configurationStore = useConfigurationStore();
const eventbus = useEventbus();

/**
 * Die Methode setzt Koordinate auf welche Zentriert werden soll.
 */
const center = computed<LatLng>(() => {
  if (props.center) {
    return props.center;
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
      configurationStore.getTenantConfiguration.mapConfiguration.lat,
      configurationStore.getTenantConfiguration.mapConfiguration.lng
    );
  }
});

const zoomValue = computed(() => {
  if (props.center) {
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

const mapRef = ref<HTMLDivElement | null>(null);
const leafletMap = useLeafletMap(mapRef, {
  center: center.value,
  zoom: zoomValue.value,
  minZoom: 8,
  maxZoom: 18,
});
const mapMarkerClusterGroup = ref<L.MarkerClusterGroup | null>(null);

onMounted(() => {
  leafletMap.initMap();
  mapMarkerClusterGroup.value = L.markerClusterGroup();
  mapMarkerClusterGroup.value?.addTo(leafletMap.map.value as L.Map);
  searchErhebungsstelle();
  leafletMap.map.value?.on("click", (e) => {
    mouseUp(e);
  });
});

onBeforeUnmount(() => {
  leafletMap.map.value?.remove();
  leafletMap.map.value = undefined;
});

const showSpeedDial = computed(() => {
  return props.center === undefined;
});

const newMarker = ref<Marker | null>(null);
const speedDialOpen = ref(false);
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

/**
 * Schaltet den Anlegen-Modus und den Zielcursor um und entfernt einen
 * eventuell neu hinzugefügten Marker.
 */
function addZaehlstellenMarker() {
  addMarker.value = !addMarker.value;
  useCustomCursor.value = !useCustomCursor.value;
  deleteNewMarkerIfExists();
}

/**
 * Setzt bei einem Kartenklick im Anlegen-Modus einen neuen Marker,
 * sofern noch keiner vorhanden ist.
 */
function mouseUp(event: LeafletMouseEvent) {
  if (addMarker.value && !newMarker.value) {
    useCustomCursor.value = false;
    createMarkerForNewZaehlstelle(event.latlng);
  }
}

/**
 * Erstellt den vorläufigen Marker für eine neue Zählstelle und fügt ihn
 * an den angegebenen Koordinaten zur Karte hinzu.
 */
function createMarkerForNewZaehlstelle(coords: LatLng) {
  newMarker.value = createNewMarker(coords);
  newMarker.value.addTo(leafletMap.map.value as L.Map);
}

/**
 * Erstellt einen verschiebbaren Marker an den angegebenen Koordinaten.
 */
function createNewMarker(coords: LatLng): Marker {
  const defaultIcon = new Icon.Default();
  defaultIcon.options.iconUrl = markerIconRed;
  defaultIcon.options.iconRetinaUrl = markerIconRed;
  return new Marker(coords, {
    icon: defaultIcon,
    opacity: 1.0,
    draggable: true,
  });
}

/**
 * Öffnet den Dialog zum Anlegen einer Zählstelle oder zeigt eine Warnung,
 * wenn noch kein neuer Marker gesetzt wurde.
 */
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

/**
 * Entfernt einen vorhandenen neuen Marker und beendet in diesem Fall
 * den Anlegen-Modus.
 */
function deleteNewMarkerIfExists() {
  if (newMarker.value) {
    newMarker.value.removeFrom(leafletMap.map.value as L.Map);
    newMarker.value = null;
    resetBooleans();
  }
}

/**
 * Deaktiviert den Anlegen-Modus und den benutzerdefinierten Cursor.
 */
function resetBooleans() {
  addMarker.value = false;
  useCustomCursor.value = false;
}

/**
 * Beendet nach dem Speichern den Anlegen-Modus, schließt den Dialog
 * und navigiert zur neu angelegten Zählstelle.
 */
function reloadDataAndCloseDialog(backendIdDTO: BackendIdDTO) {
  resetBooleans();
  closeDialog();
  routeToZaehlstelle(backendIdDTO.id);
}

/**
 * Bricht das Anlegen ab, entfernt den vorläufigen Marker und schließt
 * den Dialog.
 */
function cancelCreateZaehlstelleDialog() {
  deleteNewMarkerIfExists();
  resetBooleans();
  closeDialog();
}

/**
 * Schließt den Dialog zum Anlegen einer Zählstelle.
 */
function closeDialog() {
  showCreateZaehlstelleDialog.value = false;
}

/**
 * Wandelt Breiten- und Längengrad aus Strings in Leaflet-Koordinaten um.
 */
function createLatLngFromString(lat: string, lng: string): LatLng {
  return latLng(parseFloat(lat), parseFloat(lng));
}

const searchResult = computed(() => {
  return searchStore.getSearchResult;
});

watch(searchResult, () => {
  resetMarker();
});

watch(
  () => [eventbus.getReloadEvent, props.center],
  ([newA, newB], [prevA, prevB]) => {
    if (newA !== prevA && newB !== prevB) {
      searchErhebungsstelle();
    }
  }
);

/**
 * Entfernt und leert die bisherige Markergruppe und baut die Marker
 * anhand der aktuellen Suchergebnisse neu auf.
 */
function resetMarker(): void {
  mapMarkerClusterGroup.value?.removeFrom(leafletMap.map.value as L.Map);
  mapMarkerClusterGroup.value?.clearLayers();
  setMarkerToMap();
}

/**
 * Zeigt die Suchergebnisse als gruppierte Zählstellen- und Messstellenmarker.
 * Zentriert bei genau einem Ergebnis auf den Marker der gefundenen Zählstelle/
 * Messstelle, sonst auf das konfigurierte Zentrum.
 */
function setMarkerToMap() {
  mapMarkerClusterGroup.value?.clearLayers();
  mapMarkerClusterGroup.value = L.markerClusterGroup({
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

  mapMarkerClusterGroup.value?.addLayers(markers);
  mapMarkerClusterGroup.value?.addTo(leafletMap.map.value as L.Map);
  if (erhebungsstellenKarte.length === 1) {
    /**
     * Falls in der Main.view nach einer bestimmten Zaehlstelle gesucht
     * und diese Suche mit Druck auf die Enter-Taste eingeleitet wird,
     * umfasst das Suchergebnis somit nur eine Zaehlstelle.
     * Auf diese eine mit einem Icon angezeigte Zaehlstelle muss dann zentriert werden.
     */
    leafletMap.map.value?.setView(createLatLng(erhebungsstellenKarte[0]), 18);
  } else {
    leafletMap.map.value?.setView(center.value, zoomValue.value);
  }
}

/**
 * Sucht Erhebungsstellen mit der letzten Suchanfrage und den aktuellen Filtern.
 * Speichert das Ergebnis, meldet API-Fehler und aktualisiert die Kartenmarker.
 */
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
      resetMarker();
    });
}

/**
 * Speichert das aktuelle Kartenzentrum und die Zoomstufe im MapOptions-Store.
 */
function saveMapPosition() {
  if (!leafletMap.map.value) return;
  const mapCenter = leafletMap.map.value.getBounds().getCenter();

  const lat = mapCenter?.lat.toString();
  const lng = mapCenter?.lng.toString();
  const zoom = leafletMap.map.value.getZoom();

  mapOptionsStore.setMapOptions({
    longitude: lng,
    latitude: lat,
    zoom: zoom,
  });
}

/**
 * Navigiert zur Zählstelle mit der angegebenen ID.
 */
function routeToZaehlstelle(id: string) {
  saveMapPosition();
  router.push("/zaehlstelle/" + id);
}

/**
 * Navigiert zur Messstelle mit der angegebenen ID.
 */
function routeToMessstelle(id: string) {
  saveMapPosition();
  router.push(`/messstelle/${id}`);
}

/**
 * Erstellt Leaflet-Koordinaten aus den Positionsdaten einer Erhebungsstelle.
 */
function createLatLng(anzeigeKarte: AnzeigeKarteDTO): LatLng {
  return latLng(anzeigeKarte.latitude, anzeigeKarte.longitude);
}

/**
 * Erstellt einen Zählstellenmarker mit Tooltip und auswahlabhängiger Darstellung.
 * Ein Klick öffnet die zugehörige Zählstelle.
 */
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

/**
 * Erstellt einen Messstellenmarker mit Tooltip sowie status- und auswahlabhängigem
 * Icon. Ein Klick öffnet die zugehörige Messstelle.
 */
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
function createTooltipZaehlstelle(
  tooltipDto: TooltipZaehlstelleDTO
): HTMLElement {
  const tooltip = document.createElement("div");
  if (!tooltipDto) {
    return tooltip;
  }

  if (tooltipDto.zaehlstellennnummer) {
    const b = document.createElement("b");
    b.textContent = `Zählstelle: ${tooltipDto.zaehlstellennnummer}`;
    tooltip.appendChild(b);
    tooltip.appendChild(document.createElement("br"));
  }
  if (tooltipDto.kreuzungsname) {
    const t = document.createTextNode(tooltipDto.kreuzungsname);
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  }
  tooltip.appendChild(document.createElement("br"));

  if (!tooltipDto.stadtbezirk) {
    const t = document.createTextNode("Stadtbezirk: Keine Angabe");
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  } else {
    let label = "Stadtbezirk: ";
    if (tooltipDto.stadtbezirknummer) {
      label += `${tooltipDto.stadtbezirknummer} - `;
    }
    const t = document.createTextNode(label + tooltipDto.stadtbezirk);
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  }
  if (tooltipDto.anzahlZaehlungen) {
    const t = document.createTextNode(
      `Anzahl der Zählungen: ${tooltipDto.anzahlZaehlungen}`
    );
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));

    if (tooltipDto.datumLetzteZaehlung) {
      const d = document.createTextNode(
        `Letzte Zählung: ${tooltipDto.datumLetzteZaehlung}`
      );
      tooltip.appendChild(d);
      tooltip.appendChild(document.createElement("br"));
    }
  } else {
    const t = document.createTextNode("Noch keine Zählungen vorhanden.");
    tooltip.appendChild(t);
  }

  return tooltip;
}

/**
 * Erstellt den HTML-Tooltip mit Kennung, Verkehrsart, Lage und Betriebsdaten
 * einer Messstelle.
 */
function createTooltipMessstelle(
  tooltipDto: TooltipMessstelleDTO
): HTMLElement {
  const tooltip = document.createElement("div");
  if (!tooltipDto) {
    return tooltip;
  }

  if (tooltipDto.mstId) {
    const b = document.createElement("b");
    let text = `Messstelle: ${tooltipDto.mstId}`;
    if (tooltipDto.detektierteVerkehrsart) {
      text += ` (${tooltipDto.detektierteVerkehrsart})`;
    }
    b.textContent = text;
    tooltip.appendChild(b);
    tooltip.appendChild(document.createElement("br"));
  }
  if (tooltipDto.standort) {
    const t = document.createTextNode(tooltipDto.standort);
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  }
  tooltip.appendChild(document.createElement("br"));

  if (!tooltipDto.stadtbezirk) {
    const t = document.createTextNode("Stadtbezirk: Keine Angabe");
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  } else {
    let label = "Stadtbezirk: ";
    if (tooltipDto.stadtbezirknummer) {
      label += `${tooltipDto.stadtbezirknummer} - `;
    }
    const t = document.createTextNode(label + tooltipDto.stadtbezirk);
    tooltip.appendChild(t);
    tooltip.appendChild(document.createElement("br"));
  }

  const aufbau = document.createTextNode(
    `Aufbau: ${dateUtils.formatDate(tooltipDto.realisierungsdatum)}`
  );
  tooltip.appendChild(aufbau);
  tooltip.appendChild(document.createElement("br"));

  if (tooltipDto.abbaudatum) {
    const abbau = document.createTextNode(
      `Abbau: ${dateUtils.formatDate(tooltipDto.abbaudatum)}`
    );
    tooltip.appendChild(abbau);
    tooltip.appendChild(document.createElement("br"));
  }
  const letzte = document.createTextNode(
    `Letzte plausible Messung: ${dateUtils.formatDate(tooltipDto.datumLetztePlausibleMessung)}`
  );
  tooltip.appendChild(letzte);
  tooltip.appendChild(document.createElement("br"));

  return tooltip;
}

/**
 * Setzt die Optionen bezüglich verwendetes Icon für den Zaehlstellenmarker.
 */
function markerOptionsZaehlstelle(zaehlstelleKarte: ZaehlstelleKarteDTO) {
  if (props.zaehlstelleId) {
    if (props.zaehlstelleId === zaehlstelleKarte.id) {
      const defaultIcon = new Icon.Default();
      defaultIcon.options.iconUrl = markerIconRed;
      defaultIcon.options.iconRetinaUrl = markerIconRed;
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

  if (props.zaehlstelleId) {
    if (props.zaehlstelleId === messstelleKarte.id) {
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
