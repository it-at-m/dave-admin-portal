import type { LatLng } from "leaflet";
import type { Ref } from "vue";

import L from "leaflet";
import { ref } from "vue";

import { useConfigurationStore } from "@/store/ConfigurationStore";

export interface UseLeafletMapOptions {
  center: LatLng;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
  fullscreenControl?: boolean;
  attributionControl?: boolean;
  layerControl?: boolean;
  showOverlayLayers?: boolean;
}

const defaultOptions = {
  minZoom: 8,
  maxZoom: 18,
  zoomControl: true,
  fullscreenControl: true,
  attributionControl: true,
  layerControl: true,
  showOverlayLayers: true,
};

export function useLeafletMap(
  mapRef: Ref<HTMLDivElement | null>,
  options: UseLeafletMapOptions
) {
  options = { ...defaultOptions, ...options };

  const map = ref<L.Map | undefined>(undefined);
  const layerControl = ref<L.Control.Layers | undefined>(undefined);
  const configurationStore = useConfigurationStore();

  function initMap(): void {
    map.value = L.map(mapRef.value as HTMLElement, {
      zoom: options.zoom,
      minZoom: options.minZoom,
      maxZoom: options.maxZoom,
      preferCanvas: false,
      attributionControl: false,
      fullscreenControl: options.fullscreenControl,
      fullscreenControlOptions: {
        position: "topleft",
      },
      zoomControl: options.zoomControl,
      center: options.center,
    });
    map.value.whenReady(() => {
      setTimeout(() => {
        if (!map.value) return;

        map.value.invalidateSize();
        if (options.attributionControl) {
          map.value.addControl(
            L.control.attribution({
              position: "bottomleft",
              prefix: "Leaflet",
            })
          );
        }
        createLayersAndAddToMap();
      }, 10);
    });
  }

  function createLayersAndAddToMap(): void {
    if (!map.value) return;

    if (options.layerControl) {
      layerControl.value = L.control.layers().addTo(map.value as L.Map);
    }
    addBaseLayers();
    if (options.showOverlayLayers) {
      addOverlayLayers();
    }
  }

  /**
   * Fügt im Backend konfigurierte Base-Layer zur Karte hinzu.
   */
  function addBaseLayers(): void {
    if (!map.value) return;
    const baseLayers =
      configurationStore.getTenantConfiguration.mapConfiguration.baseLayers;
    let firstLayerAddedToMap = false;

    baseLayers.forEach((layerConfig) => {
      const layer = L.tileLayer.wms(layerConfig.baseUrl, {
        layers: layerConfig.layerName,
        className: layerConfig.layerName,
        attribution: layerConfig.attribution,
        referrerPolicy: "strict-origin-when-cross-origin",
      });
      layerControl.value?.addBaseLayer(layer, layerConfig.layerNameToDisplay);
      if (!firstLayerAddedToMap) {
        layer.addTo(map.value as L.Map);
        firstLayerAddedToMap = true;
      }
    });
  }

  /**
   * Fügt im Backend konfigurierte Overlay-Layer zur Karte hinzu.
   */
  function addOverlayLayers(): void {
    const overlayLayers =
      configurationStore.getTenantConfiguration.mapConfiguration.overlayLayers;

    overlayLayers.forEach((layerConfig) => {
      const layer = L.tileLayer.wms(layerConfig.baseUrl, {
        layers: layerConfig.layerName,
        className: layerConfig.layerName,
        transparent: true,
        format: "image/png",
        attribution: layerConfig.attribution,
        referrerPolicy: "strict-origin-when-cross-origin",
      });
      layerControl.value?.addOverlay(layer, layerConfig.layerNameToDisplay);
    });
  }

  return {
    map,
    initMap,
  };
}
