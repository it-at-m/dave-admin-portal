<template>
    <v-sheet
        :height="height"
        :width="width"
        :min-height="minheight"
    >
        <l-map
            ref="minimap"
            :options="mapOptions"
            style="z-index: 1"
            @ready="mapReady"
        >
            <l-control-layers />
            <!--      Kartenlayers. Bei layer-type="base" muss bei der Default-Karte :visible auf true gesetzt werden. -->
            <!--      layer-type="overlay" sind zusätzlich zuschaltbare Ansichten. -->

            <!--      Standardkarte Geoportal -->
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:g_stadtkarte_gesamt"
                :visible="true"
                name="Stadtkarte"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                layer-type="base"
            />
            <!--      Luftbild Geoportal -->
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:g_luftbild"
                :visible="false"
                name="Luftbild"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                layer-type="base"
            />
            <!--      OpenStreetMap -->
            <l-wms-tile-layer
                :visible="false"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a> by terrestris'
                base-url="https://ows.terrestris.de/osm/service?"
                layer-type="base"
                layers="OSM-WMS"
                name="OpenStreetMaps"
            />
            <!--      Beginn der overlay Layers   -->
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:stadtbezirk"
                :visible="true"
                :transparent="true"
                format="image/png"
                name="Stadtbezirke"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                layer-type="overlay"
            />
            <l-wms-tile-layer
                :transparent="true"
                :visible="true"
                attribution='&copy; <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Kommunalreferat/geodatenservice/geobasisdaten.html">GeodatenService München</a>'
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                format="image/png"
                layer-type="overlay"
                layers="gsm:vablock_viertel_dave"
                name="Stadtviertel"
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
import { control, Icon, LatLng, Marker } from "leaflet";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import markerIconRed from "@/assets/marker-icon-red.png";
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
export default class MiniMap extends Vue {
    @Prop({ default: "15vh" })
    readonly height!: string;

    @Prop({ default: "160px" })
    readonly minheight!: string;

    @Prop({ default: "100%" })
    readonly width!: string;
    @Prop({ default: DefaultObjectCreator.createCenterOfMunichLatLng() })
    coords!: LatLng;

    @Ref("minimap")
    private readonly theMap!: LMap;

    private zoom = 18;

    private newMarker: Marker | null = null;

    /**
     * Optionen fuer die Darstellung der Karte
     */
    mapOptions: object = {
        minZoom: 10,
        maxZoom: 18,
        preferCanvas: false,
        attributionControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: "topleft",
        },
    };

    // Wenn es neue Koordinaten gibt, wird die Karte zurückgesetzt
    // und der Marker neu eingezeichnet
    @Watch("coords")
    private resetMap() {
        setTimeout(() => {
            this.deleteNewMarker();
            this.createMarkerForNewZaehlstelle(this.coords);
            this.theMap.mapObject?.setView(this.coords, this.zoom);
        }, 200);
    }

    // Legt einen neuen Marker an der Position coords an
    // und fügt diesen der Karte hinzu
    private createMarkerForNewZaehlstelle(coords: LatLng) {
        let defaultIcon = new Icon.Default();
        defaultIcon.options.iconUrl = markerIconRed;
        this.newMarker = new Marker(coords, {
            icon: defaultIcon,
            opacity: 1.0,
            draggable: true,
        });

        this.newMarker.on("dragend", () => {
            if (this.newMarker)
                this.updateZaehlstellenCoords(this.newMarker.getLatLng());
        });

        this.newMarker.addTo(this.theMap.mapObject);
    }

    private updateZaehlstellenCoords(zaehlstellenCoords: LatLng) {
        if (zaehlstellenCoords) {
            this.$emit("updateZaehlstellenCoords", zaehlstellenCoords);
        }
    }

    // Wenn ein neuer Marker existiert wird dieser gelöscht
    // und der Anlegen-Modus wird verlassen
    private deleteNewMarker() {
        if (this.newMarker) {
            this.theMap.mapObject.removeLayer(this.newMarker);
            this.newMarker = null;
        }
    }

    mapReady() {
        this.theMap.mapObject.removeControl(control.attribution());
        /*
         * Wenn die Karte in einem Popup eingebettet ist,
         * verhält diese sich glitchy, weil es zeitlich
         * mit dem invalidateSize in onResize() kollidiert oder so.
         */
        setTimeout(() => {
            this.deleteNewMarker();
            this.createMarkerForNewZaehlstelle(this.coords);
            this.theMap.mapObject?.setView(this.coords, this.zoom);
        }, 200);
    }
}
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
