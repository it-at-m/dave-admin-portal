import type { UseLeafletMapOptions } from "@/composables/useLeafletMap";
import type LayerDTO from "@/types/karte/LayerDTO";

import L from "leaflet";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, markRaw, nextTick, ref } from "vue";

import { useLeafletMap } from "@/composables/useLeafletMap";
import { useConfigurationStore } from "@/store/ConfigurationStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

function createMapMock() {
  return markRaw({
    whenReady: vi.fn<(callback: () => void) => void>(),
    invalidateSize: vi.fn(),
    addControl: vi.fn(),
    removeLayer: vi.fn(),
  });
}

function createLayerControlMock() {
  return markRaw({
    addTo: vi.fn().mockReturnThis(),
    addBaseLayer: vi.fn(),
    addOverlay: vi.fn(),
    removeLayer: vi.fn(),
  });
}

function createLayerMock() {
  return markRaw({ addTo: vi.fn().mockReturnThis() });
}

describe("useLeafletMap", () => {
  const center = L.latLng(48.137227, 11.575517);
  const baseLayers: LayerDTO[] = [
    {
      baseUrl: "https://example.com/base/wms",
      layerName: "stadtplan",
      layerNameToDisplay: "Stadtplan",
      attribution: "Stadtplan-Quelle",
    },
    {
      baseUrl: "https://example.com/aerial/wms",
      layerName: "luftbild",
      layerNameToDisplay: "Luftbild",
      attribution: "Luftbild-Quelle",
    },
  ];
  const overlayLayers: LayerDTO[] = [
    {
      baseUrl: "https://example.com/overlay/wms",
      layerName: "stadtbezirke",
      layerNameToDisplay: "Stadtbezirke",
      attribution: "Stadtbezirke-Quelle",
    },
  ];

  let scope: ReturnType<typeof effectScope>;
  let configurationStore: ReturnType<typeof useConfigurationStore>;
  let mapMock: ReturnType<typeof createMapMock>;
  let layerControlMock: ReturnType<typeof createLayerControlMock>;
  let attributionMock: L.Control.Attribution;
  let layers: ReturnType<typeof createLayerMock>[];

  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    scope = effectScope();
    configurationStore = useConfigurationStore();
    mapMock = createMapMock();
    layerControlMock = createLayerControlMock();
    attributionMock = markRaw({}) as L.Control.Attribution;
    layers = [];

    vi.spyOn(L, "map").mockReturnValue(mapMock as unknown as L.Map);
    vi.spyOn(L.control, "layers").mockReturnValue(
      layerControlMock as unknown as L.Control.Layers
    );
    vi.spyOn(L.control, "attribution").mockReturnValue(attributionMock);
    vi.spyOn(L.tileLayer, "wms").mockImplementation(() => {
      const layer = createLayerMock();
      layers.push(layer);
      return layer as unknown as L.TileLayer.WMS;
    });
  });

  afterEach(() => {
    scope.stop();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function createComposable(options: Partial<UseLeafletMapOptions> = {}) {
    const mapRef = ref<HTMLDivElement | null>(document.createElement("div"));
    const composable = scope.run(() =>
      useLeafletMap(mapRef, { center, zoom: 12, ...options })
    );
    if (!composable) throw new Error("Effect-Scope ist nicht aktiv");
    return { ...composable, mapRef };
  }

  function setLayers(
    configuredBaseLayers: LayerDTO[] = baseLayers,
    configuredOverlayLayers: LayerDTO[] = overlayLayers
  ) {
    const configuration = DefaultObjectCreator.createDefaultConfigurationDTO();
    configuration.tenant.mapConfiguration.baseLayers = configuredBaseLayers;
    configuration.tenant.mapConfiguration.overlayLayers =
      configuredOverlayLayers;
    configurationStore.setConfiguration(configuration);
  }

  function finishInitialization() {
    const [onReady] = mapMock.whenReady.mock.calls[0];
    onReady();
    vi.advanceTimersByTime(10);
  }

  it("erstellt die Karte erst beim Aufruf von initMap mit den Standardoptionen", () => {
    const { map, mapRef, initMap } = createComposable();

    expect(map.value).toBeUndefined();
    expect(L.map).not.toHaveBeenCalled();

    initMap();

    expect(L.map).toHaveBeenCalledExactlyOnceWith(mapRef.value, {
      center,
      zoom: 12,
      minZoom: 8,
      maxZoom: 18,
      preferCanvas: false,
      attributionControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: { position: "topleft" },
      zoomControl: true,
    });
    expect(map.value).toBe(mapMock);
    expect(mapMock.whenReady).toHaveBeenCalledExactlyOnceWith(
      expect.any(Function)
    );
  });

  it("überschreibt die Standardoptionen mit den übergebenen Kartenoptionen", () => {
    const customCenter = L.latLng(49, 12);
    const { mapRef, initMap } = createComposable({
      center: customCenter,
      zoom: 10,
      minZoom: 5,
      maxZoom: 20,
      zoomControl: false,
      fullscreenControl: false,
    });

    initMap();

    expect(L.map).toHaveBeenCalledWith(
      mapRef.value,
      expect.objectContaining({
        center: customCenter,
        zoom: 10,
        minZoom: 5,
        maxZoom: 20,
        zoomControl: false,
        fullscreenControl: false,
      })
    );
  });

  it("initialisiert Größe, Attribution und Layer erst 10 ms nach Kartenbereitschaft", () => {
    setLayers();
    const { initMap } = createComposable();
    initMap();

    vi.advanceTimersByTime(100);
    expect(mapMock.invalidateSize).not.toHaveBeenCalled();
    expect(L.control.attribution).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).not.toHaveBeenCalled();

    const [onReady] = mapMock.whenReady.mock.calls[0];
    onReady();
    vi.advanceTimersByTime(9);
    expect(mapMock.invalidateSize).not.toHaveBeenCalled();
    expect(L.control.layers).not.toHaveBeenCalled();
    expect(L.control.attribution).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(mapMock.invalidateSize).toHaveBeenCalledOnce();
    expect(L.control.attribution).toHaveBeenCalledExactlyOnceWith({
      position: "bottomleft",
      prefix: "Leaflet",
    });
    expect(mapMock.addControl).toHaveBeenCalledExactlyOnceWith(attributionMock);
    expect(L.control.layers).toHaveBeenCalledOnce();
    expect(layerControlMock.addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(3);
  });

  it("fügt bei deaktivierter Attribution kein Attribution-Control hinzu", () => {
    const { initMap } = createComposable({ attributionControl: false });
    initMap();
    finishInitialization();

    expect(mapMock.invalidateSize).toHaveBeenCalledOnce();
    expect(L.control.attribution).not.toHaveBeenCalled();
    expect(mapMock.addControl).not.toHaveBeenCalled();
  });

  it("registriert alle Base-Layer und aktiviert nur den ersten auf der Karte", () => {
    setLayers(baseLayers, []);
    const { initMap } = createComposable();
    initMap();
    finishInitialization();

    expect(L.tileLayer.wms).toHaveBeenCalledTimes(2);
    baseLayers.forEach((configuration, index) => {
      expect(L.tileLayer.wms).toHaveBeenNthCalledWith(
        index + 1,
        configuration.baseUrl,
        {
          layers: configuration.layerName,
          className: configuration.layerName,
          attribution: configuration.attribution,
          referrerPolicy: "strict-origin-when-cross-origin",
        }
      );
      expect(layerControlMock.addBaseLayer).toHaveBeenNthCalledWith(
        index + 1,
        layers[index],
        configuration.layerNameToDisplay
      );
    });
    expect(layers[0].addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(layers[1].addTo).not.toHaveBeenCalled();
    expect(layerControlMock.addOverlay).not.toHaveBeenCalled();
  });

  it("registriert Overlay-Layer als transparente PNGs, ohne sie zu aktivieren", () => {
    setLayers([], overlayLayers);
    const { initMap } = createComposable();
    initMap();
    finishInitialization();

    expect(L.tileLayer.wms).toHaveBeenCalledExactlyOnceWith(
      overlayLayers[0].baseUrl,
      {
        layers: "stadtbezirke",
        className: "stadtbezirke",
        transparent: true,
        format: "image/png",
        attribution: "Stadtbezirke-Quelle",
        referrerPolicy: "strict-origin-when-cross-origin",
      }
    );
    expect(layerControlMock.addOverlay).toHaveBeenCalledExactlyOnceWith(
      layers[0],
      "Stadtbezirke"
    );
    expect(layers[0].addTo).not.toHaveBeenCalled();
    expect(layerControlMock.addBaseLayer).not.toHaveBeenCalled();
  });

  it("erstellt bei showOverlayLayers=false ausschließlich Base-Layer", () => {
    setLayers();
    const { initMap } = createComposable({ showOverlayLayers: false });
    initMap();
    finishInitialization();

    expect(L.tileLayer.wms).toHaveBeenCalledTimes(2);
    expect(layerControlMock.addBaseLayer).toHaveBeenCalledTimes(2);
    expect(layerControlMock.addOverlay).not.toHaveBeenCalled();
  });

  it("erstellt bei layerControl=false Layer ohne Layer-Control", () => {
    setLayers();
    const { initMap } = createComposable({ layerControl: false });
    initMap();
    finishInitialization();

    expect(L.control.layers).not.toHaveBeenCalled();
    expect(layerControlMock.addBaseLayer).not.toHaveBeenCalled();
    expect(layerControlMock.addOverlay).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(3);
    expect(layers[0].addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(layers[1].addTo).not.toHaveBeenCalled();
    expect(layers[2].addTo).not.toHaveBeenCalled();
  });

  it("verarbeitet eine Konfiguration ohne Layer", () => {
    const { initMap } = createComposable();
    initMap();
    finishInitialization();

    expect(L.control.layers).toHaveBeenCalledOnce();
    expect(L.tileLayer.wms).not.toHaveBeenCalled();
    expect(layerControlMock.addBaseLayer).not.toHaveBeenCalled();
    expect(layerControlMock.addOverlay).not.toHaveBeenCalled();
  });

  it("lädt nachträglich konfigurierte Layer und verwendet das vorhandene Layer-Control", async () => {
    const { initMap } = createComposable();
    initMap();
    finishInitialization();

    setLayers();
    await nextTick();

    expect(L.control.layers).toHaveBeenCalledOnce();
    expect(layerControlMock.addTo).toHaveBeenCalledOnce();
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(3);
    expect(layerControlMock.addBaseLayer).toHaveBeenCalledTimes(2);
    expect(layerControlMock.addOverlay).toHaveBeenCalledExactlyOnceWith(
      layers[2],
      "Stadtbezirke"
    );
    expect(layers[0].addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(mapMock.invalidateSize).toHaveBeenCalledOnce();
    expect(L.control.attribution).toHaveBeenCalledOnce();
  });

  it("entfernt bei Konfigurationsänderungen bisherige Layer und registriert die neuen", async () => {
    setLayers();
    const { initMap } = createComposable();
    initMap();
    finishInitialization();
    const previousLayers = [...layers];
    const newBaseLayer: LayerDTO = {
      baseUrl: "https://example.com/new-base/wms",
      layerName: "neuer-stadtplan",
      layerNameToDisplay: "Neuer Stadtplan",
      attribution: "Neue Stadtplan-Quelle",
    };
    const newOverlayLayer: LayerDTO = {
      baseUrl: "https://example.com/new-overlay/wms",
      layerName: "neue-stadtbezirke",
      layerNameToDisplay: "Neue Stadtbezirke",
      attribution: "Neue Stadtbezirke-Quelle",
    };

    setLayers([newBaseLayer], [newOverlayLayer]);
    await nextTick();

    expect(mapMock.removeLayer).toHaveBeenCalledTimes(3);
    expect(layerControlMock.removeLayer).toHaveBeenCalledTimes(3);
    previousLayers.forEach((layer, index) => {
      expect(mapMock.removeLayer).toHaveBeenNthCalledWith(index + 1, layer);
      expect(layerControlMock.removeLayer).toHaveBeenNthCalledWith(
        index + 1,
        layer
      );
    });
    expect(mapMock.removeLayer.mock.invocationCallOrder[2]).toBeLessThan(
      vi.mocked(L.tileLayer.wms).mock.invocationCallOrder[3]
    );
    expect(
      layerControlMock.removeLayer.mock.invocationCallOrder[2]
    ).toBeLessThan(vi.mocked(L.tileLayer.wms).mock.invocationCallOrder[3]);
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(5);
    expect(layerControlMock.addBaseLayer).toHaveBeenLastCalledWith(
      layers[3],
      newBaseLayer.layerNameToDisplay
    );
    expect(layerControlMock.addOverlay).toHaveBeenLastCalledWith(
      layers[4],
      newOverlayLayer.layerNameToDisplay
    );
    expect(layers[3].addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(layers[4].addTo).not.toHaveBeenCalled();
    expect(L.control.layers).toHaveBeenCalledOnce();
    expect(layerControlMock.addTo).toHaveBeenCalledOnce();

    setLayers([], []);
    await nextTick();

    expect(mapMock.removeLayer).toHaveBeenCalledTimes(5);
    expect(layerControlMock.removeLayer).toHaveBeenCalledTimes(5);
    [layers[3], layers[4]].forEach((layer, index) => {
      expect(mapMock.removeLayer).toHaveBeenNthCalledWith(index + 4, layer);
      expect(layerControlMock.removeLayer).toHaveBeenNthCalledWith(
        index + 4,
        layer
      );
    });
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(5);
  });

  it("beachtet deaktivierte Layer-Optionen auch bei Konfigurationsänderungen", async () => {
    const { initMap } = createComposable({
      layerControl: false,
      showOverlayLayers: false,
    });
    initMap();
    finishInitialization();

    setLayers();
    await nextTick();

    expect(L.control.layers).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).toHaveBeenCalledTimes(2);
    expect(layers[0].addTo).toHaveBeenCalledExactlyOnceWith(mapMock);
    expect(layers[1].addTo).not.toHaveBeenCalled();
  });

  it("berücksichtigt Konfigurationsänderungen vor initMap erst bei der Initialisierung", async () => {
    const { map, initMap } = createComposable();

    setLayers();
    await nextTick();

    expect(map.value).toBeUndefined();
    expect(L.control.layers).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).not.toHaveBeenCalled();

    initMap();
    finishInitialization();

    expect(L.tileLayer.wms).toHaveBeenCalledTimes(3);
  });

  it("bricht die verzögerte Initialisierung ab, wenn die Kartenreferenz geleert wurde", () => {
    setLayers();
    const { map, initMap } = createComposable();
    initMap();
    const [onReady] = mapMock.whenReady.mock.calls[0];
    onReady();

    map.value = undefined;
    vi.advanceTimersByTime(10);

    expect(mapMock.invalidateSize).not.toHaveBeenCalled();
    expect(mapMock.addControl).not.toHaveBeenCalled();
    expect(L.control.layers).not.toHaveBeenCalled();
    expect(L.tileLayer.wms).not.toHaveBeenCalled();
  });
});
