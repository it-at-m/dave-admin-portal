<template>
    <v-sheet
        :height="height"
        :width="width"
        :min-height="minheight"
    >
        <l-map
            ref="map"
            :zoom="zoom"
            :options="mapOptions"
            :style="{ zIndex: 1, cursor: customCursor }"
            @mouseup="mouseUp"
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
                :attribution="mapAttribution"
                layer-type="base"
            />
            <!--      Luftbild Geoportal -->
            <l-wms-tile-layer
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                layers="gsm:g_luftbild"
                :visible="false"
                name="Luftbild"
                :attribution="mapAttribution"
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
                :visible="false"
                :transparent="true"
                format="image/png"
                name="Stadtbezirke"
                :attribution="mapAttribution"
                layer-type="overlay"
            />
            <l-wms-tile-layer
                :transparent="true"
                :visible="false"
                :attribution="mapAttribution"
                base-url="https://geoportal.muenchen.de/geoserver/gsm/wms?"
                format="image/png"
                layer-type="overlay"
                layers="gsm:vablock_viertel_dave"
                name="Stadtviertel"
            />
        </l-map>

        <div v-if="showSpeedDial">
            <v-speed-dial
                v-if="!hasNewMarker"
                v-model="fab"
                absolute
                bottom
                right
            >
                <template #activator>
                    <v-btn
                        v-model="fab"
                        dark
                        fab
                        color="secondary"
                        @click="addZaehlstellenMarker"
                    >
                        <v-icon v-if="addMarker"> mdi-close </v-icon>
                        <v-icon v-else> mdi-map-marker-plus-outline </v-icon>
                    </v-btn>
                </template>
            </v-speed-dial>

            <v-speed-dial
                v-if="hasNewMarker"
                v-model="fab2"
                absolute
                bottom
                right
                open-on-hover
            >
                <template #activator>
                    <v-btn
                        v-model="fab2"
                        dark
                        fab
                        color="secondary"
                    >
                        <v-icon> mdi-check </v-icon>
                        /
                        <v-icon> mdi-delete </v-icon>
                    </v-btn>
                </template>
                <v-btn
                    fab
                    dark
                    small
                    color="green"
                    @click="createZaehlstelle"
                >
                    <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                    fab
                    dark
                    small
                    color="red"
                    @click="deleteNewMarker"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-speed-dial>
        </div>

        <create-zaehlstelle-dialog
            v-model="showCreateZaehlstelleDialog"
            :coords="newCoords"
            @saved="reloadDataAndCloseDialog"
            @cancel="cancelCreateZaehlstelleDialog"
        >
        </create-zaehlstelle-dialog>
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
import SucheService from "@/api/service/SucheService";

/* eslint-disable no-unused-vars */
import L, {
    control,
    Icon,
    LatLng,
    latLng,
    LeafletMouseEvent,
    Marker,
} from "leaflet";
import ZaehlstelleKarteDTO from "@/domain/dto/ZaehlstelleKarteDTO";
import { Levels } from "@/api/error";
import CreateZaehlstelleDialog from "@/components/zaehlstelle/CreateZaehlstelleDialog.vue";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import TooltipDTO from "@/domain/dto/TooltipDTO";
import markerIconRed from "@/assets/marker-icon-red.png";
import markerIconDiamondViolet from "@/assets/cards-diamond-violet.png";
import markerIconDiamondRed from "@/assets/cards-diamond-red.png";
import TooltipMessstelleDTO from "@/domain/dto/TooltipMessstelleDTO";
import AnzeigeKarteDTO from "@/domain/dto/AnzeigeKarteDTO";
import MessstelleKarteDTO from "@/domain/dto/MessstelleKarteDTO";
/* eslint-enable no-unused-vars */

@Component({
    components: {
        CreateZaehlstelleDialog,
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
export default class ZaehlstelleMap extends Vue {
    @Prop({ default: "15vh" })
    readonly height!: string;

    @Prop({ default: "160px" })
    readonly minheight!: string;

    @Prop({ default: "100%" })
    readonly width!: string;

    @Prop({ default: 12 })
    zoom!: number;

    @Ref("map")
    private readonly theMap!: LMap;

    private static readonly MUNICH_CENTER_LATITUDE: string = "48.137227";

    private static readonly MUNICH_CENTER_LONGITUDE: string = "11.575517";

    private mapMarkerClusterGroup = L.markerClusterGroup();

    private newMarker: Marker | null = null;

    addMarker = false;

    fab = false;
    fab2 = false;

    private useCustomCursor = false;

    showCreateZaehlstelleDialog = false;

    @Prop()
    private zId?: string;
    @Prop()
    private latlng?: string[];

    @Prop()
    private reload?: boolean;

    @Ref("map") readonly printMap!: any;
    @Ref("sheet") readonly sheet!: HTMLDivElement;
    private base64 = "base64";

    readonly mapAttribution =
        '&copy; <a href="https://stadt.muenchen.de/infos/geobasisdaten.html">GeodatenService München</a>';

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

    mounted() {
        this.searchZaehlstelle();
    }

    get getZaehlstellenKarteFromStore(): AnzeigeKarteDTO[] {
        return this.$store.getters["search/result"];
    }

    get showSpeedDial(): boolean {
        return !(this.latlng !== undefined && this.latlng.length === 2);
    }

    /**
     * Die Methode setzt Koordinate auf welche Zentriert werden soll.
     */
    get center(): LatLng {
        if (this.latlng && this.latlng.length == 2) {
            return this.createLatLngFromString(this.latlng[0], this.latlng[1]);
        } else {
            // Mitte von München
            return this.createLatLngFromString(
                ZaehlstelleMap.MUNICH_CENTER_LATITUDE,
                ZaehlstelleMap.MUNICH_CENTER_LONGITUDE
            );
        }
    }

    // Schalter zum Wechseln der Buttons
    get hasNewMarker(): boolean {
        return this.newMarker !== null;
    }

    get newCoords(): LatLng {
        if (this.hasNewMarker) {
            // Da wir gerade auf 'null' überprüft haben können wir dem Compiler mit '!' mitteilen, dass newMarker auf jeden Fall gesetzt ist
            return this.newMarker!.getLatLng();
        } else {
            return DefaultObjectCreator.createCenterOfMunichLatLng();
        }
    }

    get customCursor(): string {
        if (this.useCustomCursor) {
            return `url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='24' height='24' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z'/%3E %3C/svg%3E") 12 12,auto`;
        } else {
            return "auto";
        }
    }

    @Watch("$store.state.search.result")
    private resetMarker() {
        // Alte Layer entfernen bevor neue eingezeichnet werden
        this.theMap.mapObject.removeLayer(this.mapMarkerClusterGroup);
        this.deleteNewMarker();
        this.setMarkerToMap();
    }

    @Watch("reload")
    private searchZaehlstelle() {
        SucheService.searchZaehlstelle(
            this.$store.getters["search/lastSearchQuery"]
        )
            .then((result) => {
                // fügt testdaten für Messstellen hinzu, muss später entfernt werden sobald der richtige Service verfügbar ist
                result.push(...SucheService.getMockMessstelleKarte());
                this.$store.commit("search/result", result);
            })
            .catch((error) => {
                this.$store.dispatch("snackbar/showError", error);
            })
            .finally(() => {
                this.setMarkerToMap();
            });
    }

    // Erzeugt für jede vorhandene Zaehlstelle einen Marker
    // und fuegt diesen dem MarkerCluster hinzu
    private setMarkerToMap() {
        // Setzen einer leeren ZaehlstelleKarte ohne Marker
        this.mapMarkerClusterGroup.clearLayers();
        this.mapMarkerClusterGroup = L.markerClusterGroup({
            disableClusteringAtZoom: 15,
            spiderfyOnMaxZoom: false,
            chunkedLoading: true,
        });

        const zaehlstellenKarte: AnzeigeKarteDTO[] =
            this.getZaehlstellenKarteFromStore;
        const markers: Array<Marker> = [];
        zaehlstellenKarte.forEach((anzeigeKarte) => {
            if (anzeigeKarte.type != "messstelle") {
                markers.push(
                    this.createMarkerForZaehlstelle(
                        anzeigeKarte as ZaehlstelleKarteDTO
                    )
                );
            } else {
                markers.push(
                    this.createMarkerForMessstelle(
                        anzeigeKarte as MessstelleKarteDTO
                    )
                );
            }
        });
        this.mapMarkerClusterGroup.addLayers(markers);
        this.theMap.mapObject.addLayer(this.mapMarkerClusterGroup);

        if (zaehlstellenKarte.length === 1) {
            /**
             * Falls in der Main.view nach einer bestimmten Zaehlstelle gesucht
             * und diese Suche mit Druck auf die Enter-Taste eingeleitet wird,
             * umfasst das Suchergebnis somit nur eine Zaehlstelle.
             * Auf diese eine mit einem Icon angezeigte Zaehlstelle muss dann zentriert werden.
             */
            this.theMap.mapObject.setView(
                this.createLatLng(zaehlstellenKarte[0]),
                18
            );
        } else if (this.zId == null) {
            this.theMap.mapObject.setView(this.center, 12);
        } else {
            this.theMap.mapObject.setView(this.center, 18);
        }
    }

    // Erzeugt einen Marker für die Karte
    private createMarkerForZaehlstelle(
        zaehlstelleKarte: ZaehlstelleKarteDTO
    ): Marker {
        let marker: Marker = new Marker(
            this.createLatLng(zaehlstelleKarte),
            this.markerOptionsZaehlstelle(zaehlstelleKarte)
        );
        marker.bindTooltip(this.createTooltip(zaehlstelleKarte.tooltip), {
            direction: "top",
            offset: [-14, 0],
        });

        marker.on("click", () => {
            // Zeige alle Zaehlungen zur Zaehlstelle an.
            this.routeToZaehlstelle(zaehlstelleKarte.id);
        });
        return marker;
    }

    private createMarkerForMessstelle(
        messstelleKarteDto: MessstelleKarteDTO
    ): Marker {
        let marker: Marker = new Marker(
            this.createLatLng(messstelleKarteDto),
            this.markerOptionsMessstelle(messstelleKarteDto)
        );
        const icon = L.divIcon({
            html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee82ee"><title>cards-diamond</title><path  d="M19,12L12,22L5,12L12,2" /></svg>',
            iconSize: [40, 40], // size of the icon
            iconAnchor: [20, 40],
            className: "leaflet-custom-div-icon",
        });
        marker.setIcon(icon);
        marker.bindTooltip(
            this.createTooltipMessstelle(messstelleKarteDto.tooltip),
            {
                direction: "top",
                offset: [0, -35],
            }
        );
        marker.on("click", () => {
            // Zeige alle Zaehlungen zur Zaehlstelle an.
            this.routeToMessstelle(messstelleKarteDto.id);
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
    private createTooltip(tooltipDto: TooltipDTO): string {
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

    private createTooltipMessstelle(tooltipDto: TooltipMessstelleDTO): string {
        let tooltip = "<div><b>";
        if (tooltipDto.mstId) {
            tooltip = `${tooltip}MST_ID: ${tooltipDto.mstId}</b><br/>`;
        }
        tooltip = `${tooltip}<br/>`;
        if (tooltipDto.standortDatenportal) {
            tooltip = `${tooltip}Standort Datenportal: ${tooltipDto.standortDatenportal}<br/>`;
        }
        if (tooltipDto.stadtbezirk) {
            tooltip = `${tooltip}Stadtbezirk: ${tooltipDto.stadtbezirk}<br/>`;
        }
        if (tooltipDto.realisierungsdatum) {
            tooltip = `${tooltip} Aufbau: ${tooltipDto.realisierungsdatum}<br/>`;
        }
        if (tooltipDto.abbaudatum) {
            tooltip = `${tooltip}Abbau: ${tooltipDto.abbaudatum}<br/>`;
        }
        if (tooltipDto.kfz) {
            const yesNo = tooltipDto.kfz ? "ja" : "nein";
            tooltip = `${tooltip}KFZ: ${yesNo}</b><br/>`;
        }
        if (tooltipDto.datumLetzteMessung) {
            tooltip = `${tooltip}Letzter Messtag: ${tooltipDto.datumLetzteMessung}<br/>`;
        }

        tooltip = `${tooltip}</div>`;
        return tooltip;
    }

    /**
     * Setzt die Optionen bezüglich verwendetes Icon für den Zaehlstellenmarker.
     */
    private markerOptionsZaehlstelle(zaehlstelleKarte: ZaehlstelleKarteDTO) {
        if (this.zId) {
            if (this.zId === zaehlstelleKarte.id) {
                let defaultIcon = new Icon.Default();
                defaultIcon.options.iconUrl = markerIconRed;
                return { opacity: 1.0, icon: defaultIcon };
            } else {
                return { opacity: 0.5 };
            }
        } else {
            return { opacity: 1.0 };
        }
    }

    /**
     * Setzt die Optionen bezüglich verwendetes Icon für den Messstellenmarker.
     */
    private markerOptionsMessstelle(messstelleKarte: MessstelleKarteDTO) {
        let defaultIcon = new Icon.Default();
        defaultIcon.options.iconUrl = markerIconDiamondViolet;
        if (this.zId) {
            if (this.zId === messstelleKarte.id) {
                defaultIcon.options.iconUrl = markerIconDiamondRed;
                return { opacity: 1.0, icon: defaultIcon };
            } else {
                return { opacity: 0.5, icon: defaultIcon };
            }
        } else {
            return { opacity: 1.0, icon: defaultIcon };
        }
    }

    // Extrahiert aus der Zaehlstelle die Koordinaten
    private createLatLng(anzeigeKarte: AnzeigeKarteDTO): LatLng {
        return latLng(anzeigeKarte.latitude, anzeigeKarte.longitude);
    }

    // Erzeugt aus den String Koordinaten ein Objekt von Typ LatLng
    private createLatLngFromString(lat: string, lng: string): LatLng {
        return latLng(parseFloat(lat), parseFloat(lng));
    }

    // Button-Klick-Event um in den Anlegen-Modus zu wechseln.
    addZaehlstellenMarker() {
        this.addMarker = !this.addMarker;
        this.useCustomCursor = !this.useCustomCursor;
        this.deleteNewMarker();
    }

    // Klick-Event zum anlegen eines neuen Markers auf der Karte
    mouseUp(event: LeafletMouseEvent) {
        if (this.addMarker && !this.newMarker) {
            this.useCustomCursor = false;
            this.createMarkerForNewZaehlstelle(event.latlng);
        }
    }

    // Legt einen neuen Marker an der Position coords an
    // und fügt diesen der Karte hinzu
    private createMarkerForNewZaehlstelle(coords: LatLng) {
        this.newMarker = this.createNewMarker(coords);
        this.newMarker.addTo(this.theMap.mapObject);
    }

    // Erzeugt einen neuen roten Marker auf der Karte
    private createNewMarker(coords: LatLng): Marker {
        let defaultIcon = new Icon.Default();
        defaultIcon.options.iconUrl = markerIconRed;
        return new Marker(coords, {
            icon: defaultIcon,
            opacity: 1.0,
            draggable: true,
        });
    }

    // Klick-Event zum Oeffnen des ZaehlstelleCreateDialog
    createZaehlstelle() {
        if (this.newMarker) {
            this.showCreateZaehlstelleDialog = true;
        } else {
            // Fehler Toast, dass kein Marker vorhanden
            this.$store.dispatch("snackbar/showToast", {
                level: Levels.WARNING,
                snackbarTextPart1:
                    "Es wurde keine neue Zählstelle auf der Karte markiert.",
            });
        }
    }

    // Wenn ein neuer Marker existiert wird dieser gelöscht
    // und der Anlegen-Modus wird verlassen
    deleteNewMarker() {
        if (this.newMarker) {
            this.theMap.mapObject.removeLayer(this.newMarker);
            this.newMarker = null;
            this.resetBooleans();
        }
    }

    reloadDataAndCloseDialog(backendIdDTO: BackendIdDTO) {
        this.searchZaehlstelle();
        this.resetBooleans();
        this.closeDialog();
        this.routeToZaehlstelle(backendIdDTO.id);
    }

    cancelCreateZaehlstelleDialog() {
        this.deleteNewMarker();
        this.resetBooleans();
        this.closeDialog();
    }

    private resetBooleans() {
        this.fab = false;
        this.fab2 = false;
        this.addMarker = false;
        this.useCustomCursor = false;
    }

    private closeDialog() {
        this.showCreateZaehlstelleDialog = false;
    }

    private routeToZaehlstelle(id: string) {
        this.$router.push("/zaehlstelle/" + id);
    }

    private routeToMessstelle(id: string) {
        this.$router.push("/messstelle/" + id);
    }

    mapReady() {
        this.theMap.mapObject.addControl(
            control.attribution({
                position: "bottomleft",
                prefix: "",
            })
        );
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
