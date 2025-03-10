<template>
    <v-sheet
        :height="height"
        :width="width"
        :min-height="minheight"
    >
        <l-map
            ref="zaehlungcardmap"
            :options="mapOptions"
            style="z-index: 1"
            @ready="mapReady"
        >
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:g_luftbild"
                :visible="showLuftbild"
                name="Luftbild"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                layer-type="base"
            />
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:g_stadtkarte_gesamt"
                :visible="!showLuftbild"
                name="Stadtkarte"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                layer-type="base"
            />
        </l-map>
    </v-sheet>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
// imports for leaflet
import {
    LCircleMarker,
    LControlLayers,
    LIcon,
    LLayerGroup,
    LMap,
    LMarker,
    LTileLayer,
    LTooltip,
    LWMSTileLayer,
} from "vue2-leaflet";
// Api
/* eslint-disable no-unused-vars */
import {
    CircleMarker,
    CircleMarkerOptions,
    control,
    Icon,
    LatLng,
    Marker,
    MarkerOptions,
} from "leaflet";
import markerIconRed from "@/assets/marker-icon-red.png";
import { useZaehlungStore } from "@/store/ZaehlungStore";
/* eslint-enable no-unused-vars */

@Component({
    components: {
        LIcon,
        LMap,
        LTileLayer,
        LMarker,
        LCircleMarker,
        LTooltip,
        LControlLayers,
        LLayerGroup,
        "l-wms-tile-layer": LWMSTileLayer,
    },
})
export default class ZaehlungCardMap extends Vue {
    @Prop({ default: "15vh" })
    readonly height!: string;

    @Prop({ default: "160px" })
    readonly minheight!: string;

    @Prop({ default: "100%" })
    readonly width!: string;

    @Ref("zaehlungcardmap")
    private readonly theMap!: LMap;

    private zoom = 16;

    @Prop()
    private readonly latLngZaehlstelle!: LatLng;
    @Prop()
    private readonly latLngZaehlung!: LatLng;

    @Prop({ default: true })
    readonly showLuftbild!: boolean;

    @Prop({ default: false })
    private readonly editZaehlungMarker!: boolean;

    private markerZaehlstelle: CircleMarker | null = null;
    private markerZaehlung: Marker | null = null;

    private zaehlungStore = useZaehlungStore();

    /**
     * Optionen fuer die Darstellung der Karte
     */
    mapOptions: object = {
        minZoom: 10,
        maxZoom: 18,
        preferCanvas: false,
        zoomControl: false,
        attributionControl: false,
    };

    get resetFormEvent(): boolean {
        return this.zaehlungStore.getResetformevent;
    }

    @Watch("resetFormEvent")
    private resetForm() {
        this.zoom = 16;
        this.resetMap();
    }

    private resetMap() {
        setTimeout(() => {
            this.deleteMarkers();
            if (this.latLngZaehlstelle) {
                this.createMarkerForZaehlstelle(this.latLngZaehlstelle);
            }
            if (this.latLngZaehlung) {
                this.createMarkerForZaehlung(this.latLngZaehlung);
            }
            this.theMap.mapObject?.setView(this.latLngZaehlstelle, this.zoom);
        }, 200);
    }

    // Legt einen neuen Marker für die Zählstelle an
    private createMarkerForZaehlstelle(coords: LatLng) {
        let options: CircleMarkerOptions = {} as CircleMarkerOptions;
        options.opacity = 1.0;
        options.radius = 20;

        this.markerZaehlstelle = new CircleMarker(coords, options);

        this.markerZaehlstelle.bindTooltip("Zählstelle", {
            direction: "right",
            offset: [options.radius, 0],
        });

        this.markerZaehlstelle.addTo(this.theMap.mapObject);
    }

    // Legt einen neuen Marker für die Zählung an
    private createMarkerForZaehlung(coords: LatLng) {
        let defaultIcon = new Icon.Default();
        defaultIcon.options.iconUrl = markerIconRed;

        let options: MarkerOptions = {} as MarkerOptions;
        options.opacity = 1.0;
        options.icon = defaultIcon;
        options.draggable = this.editZaehlungMarker;

        this.markerZaehlung = new Marker(coords, options);

        this.markerZaehlung.on("dragend", () => {
            if (this.markerZaehlung)
                this.updateZaehlungCoords(this.markerZaehlung.getLatLng());
        });

        this.markerZaehlung.addTo(this.theMap.mapObject);
    }

    // Wenn ein Marker existiert wird dieser gelöscht
    private deleteMarkers() {
        if (this.markerZaehlstelle) {
            this.theMap.mapObject.removeLayer(this.markerZaehlstelle);
            this.markerZaehlstelle = null;
        }
        if (this.markerZaehlung) {
            this.theMap.mapObject.removeLayer(this.markerZaehlung);
            this.markerZaehlung = null;
        }
    }

    mapReady() {
        /*
         * Wenn die Karte in einem Popup eingebettet ist,
         * verhält diese sich glitchy, weil es zeitlich
         * mit dem invalidateSize in onResize() kollidiert oder so.
         */
        this.resetMap();
        this.theMap.mapObject.removeControl(control.attribution());
    }

    private updateZaehlungCoords(zaehlungCoords: LatLng) {
        if (this.editZaehlungMarker && zaehlungCoords) {
            this.$emit("updateZaehlungCoords", zaehlungCoords);
        }
    }
}
</script>