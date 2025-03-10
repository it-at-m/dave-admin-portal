<template>
    <v-app v-if="isFachadmin">
        <TheSnackbar />

        <!--  clipped-right: Gibt an, auf welcher Seite der Navigation-Drawer eingeblendet werden soll und dort soll die Toolbar bleiben  -->
        <v-app-bar
            app
            clipped-right
            color="primary"
            dark
        >
            <router-link to="/">
                <v-toolbar-title class="white--text">
                    <span class="font-weight-medium">DAVe</span>
                    <span class="font-weight-thin"> | Adminportal</span>
                </v-toolbar-title>
            </router-link>
            <v-spacer></v-spacer>
            <v-autocomplete
                id="suchfeld"
                v-model="selectedSuggestion"
                :items="getSuggestions"
                :search-input.sync="searchQuery"
                clearable
                color="black"
                flat
                hide-details
                label="Suche"
                no-filter
                prepend-inner-icon="mdi-magnify"
                return-object
                solo-inverted
                @keyup.enter="searchOrShowSelectedSuggestion"
                @keyup.delete="deleteChar"
                @update:list-index="updateSearchQuery"
                @update:search-input="suggest"
                @click:clear="clear"
            >
                <template #no-data>
                    <v-list class="pa-3">
                        <v-list-item-title>
                            Keine Suchvorschläge...
                        </v-list-item-title>
                    </v-list>
                </template>
                <template #item="{ item }">
                    <v-list-item-content>
                        <v-list-item-title
                            v-if="item.type === suggestionTypeVorschlag"
                            @click="searchForSuggestion(item.text)"
                        >
                            <v-icon small>mdi-magnify</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === suggestionTypeZaehlstelle"
                            @click="showZaehlstelle(item)"
                        >
                            <v-icon small>mdi-map-marker</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === suggestionTypeZaehlung"
                            @click="showZaehlung(item)"
                        >
                            <v-icon small>mdi-counter</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === suggestionTypeMessstelle"
                            @click="showMessstelle(item)"
                        >
                            <v-icon small>mdi-cards-diamond</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </template>
            </v-autocomplete>
            <v-tooltip
                v-model="showtooltip"
                bottom
                nudge-right="180"
            >
                <template #activator="{ attrs }">
                    <v-btn
                        v-bind="attrs"
                        class="ml-2"
                        icon
                        @click="showtooltip = !showtooltip"
                    >
                        <v-icon>mdi-information</v-icon>
                    </v-btn>
                </template>
                <span>
                    <b>Beispiele, wonach gesucht werden kann:</b><br />
                    * Zählstellnummer / -art (123456, 123456T, ...)<br />
                    * Schlagwörter (Bahn, Isar, Tunnel, Brücke, ...)<br />
                    * Monat (Januar, Februar, ...)<br />
                    * Jahreszeit (Frühling, Sommer, ...)<br />
                    * Projektname / -nummer (U1022, VZ Stadtgrenzen 2019,
                    ...)<br />
                    * Straßen- / Platzname (Rosenheimerplatz, Dachauer Straße,
                    ...)<br />
                    * Messstellennummer / -name (4203,...)<br />
                    <!--            Es fehlt noch: Wetter, Schulzeit, (erweiterte) Zählsituation-->
                </span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <unread-messages />
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        class="ml-2 mr-2"
                        icon
                        small
                        v-on="on"
                        @click="navigateToErhebungsstellenOverview"
                    >
                        <v-icon>mdi-clipboard-list-outline</v-icon>
                    </v-btn>
                </template>
                <span> Zählungen & Messstellen </span>
            </v-tooltip>
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        class="ml-2 mr-2"
                        icon
                        small
                        v-on="on"
                        @click="navigateToConfig"
                    >
                        <v-icon>mdi-cogs</v-icon>
                    </v-btn>
                </template>
                <span> Konfiguration </span>
            </v-tooltip>
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        class="ml-2 mr-2"
                        icon
                        small
                        v-on="on"
                        @click="navigateToHandbuch"
                    >
                        <v-icon>mdi-clippy</v-icon>
                    </v-btn>
                </template>
                <span> Anwenderhandbuch </span>
            </v-tooltip>
            <span> {{ loggedInUser }} </span>
        </v-app-bar>
        <v-main>
            <v-fade-transition mode="out-in">
                <!--    Damit Seite auch bei ID Aenderung reloadet wird muss der :key angegeben werden -->
                <router-view :key="$route.fullPath"></router-view>
            </v-fade-transition>
        </v-main>
    </v-app>
    <v-overlay
        v-else
        color="white"
    >
        <p
            style="
                text-align: center;
                color: black;
                font-weight: bold;
                font-size: xxx-large;
            "
        >
            Sie verfügen nicht über die nötigen Rechte diese Anwendung zu
            benutzen
        </p>
        <p style="text-align: center; color: black; font-size: x-large">
            Bitte wenden Sie sich an einen Administrator
        </p>
    </v-overlay>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// Komponenten
import TheSnackbar from "@/components/common/TheSnackbar.vue";
import UnreadMessages from "@/components/app/UnreadMessages.vue";

// API
import SsoUserInfoService from "@/api/service/SsoUserInfoService";
import VersionInfoService from "@/api/service/VersionInfoService";

/* eslint-disable no-unused-vars */
import SucheService from "@/api/service/SucheService";
import Suggest from "@/domain/Suggest";
import SsoUserInfoResponse from "@/domain/SsoUserInfoResponse";
import VersionInfoResponse from "@/domain/VersionInfoResponse";
import SucheWordSuggestDTO from "@/domain/dto/suche/SucheWordSuggestDTO";
import SucheComplexSuggestsDTO from "@/domain/dto/suche/SucheComplexSuggestsDTO";
import SucheZaehlungSuggestDTO from "@/domain/dto/suche/SucheZaehlungSuggestDTO";
import SucheZaehlstelleSuggestDTO from "@/domain/dto/suche/SucheZaehlstelleSuggestDTO";
import SucheMessstelleSuggestDTO from "@/domain/dto/suche/SucheMessstelleSuggestDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import { useUserStore } from "@/store/UserStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useSearchStore } from "@/store/SearchStore";
import _ from "lodash";
/* eslint-enable no-unused-vars */

@Component({
    components: { TheSnackbar, UnreadMessages },
})
export default class App extends Vue {
    private static readonly SUGGESTION_TYPE_VORSCHLAG: string = "vorschlag";

    private static readonly SUGGESTION_TYPE_ZAEHLSTELLE: string = "zaehlstelle";

    private static readonly SUGGESTION_TYPE_ZAEHLUNG: string = "zaehlung";

    private static readonly SUGGESTION_TYPE_MESSSTELLE: string = "messstelle";

    private static readonly URL_HANDBUCH_LINK: string =
        "https://wilma.muenchen.de/web/senders/af10dc2a-8da5-4d24-815a-b6a9df4c686b/documents/54ddf065-d01f-4965-9bdf-c66ea47927c8";

    showtooltip = false;

    loggedInUser = "no-security";

    // Versionen
    private backendVersion = "";

    private frontendVersion = "";

    // Suche
    searchQuery = "";

    private lastSuggestQuery = "";

    private suggestions: Suggest[] = [];

    selectedSuggestion: Suggest | null =
        DefaultObjectCreator.createDefaultSuggestion();

    private userStore = useUserStore();
    private snackbarStore = useSnackbarStore();
    private searchStore = useSearchStore();

    get isFachadmin() {
        if (
            BaseUrlProvider.isDevelopment() &&
            this.userStore.hasNoAuthorities
        ) {
            return true;
        } else {
            return this.userStore.isFachadmin;
        }
    }

    get getSuggestions() {
        return this.suggestions;
    }

    get suggestionTypeVorschlag(): string {
        return App.SUGGESTION_TYPE_VORSCHLAG;
    }

    get suggestionTypeZaehlstelle(): string {
        return App.SUGGESTION_TYPE_ZAEHLSTELLE;
    }

    get suggestionTypeZaehlung(): string {
        return App.SUGGESTION_TYPE_ZAEHLUNG;
    }

    get suggestionTypeMessstelle(): string {
        return App.SUGGESTION_TYPE_MESSSTELLE;
    }

    // Lifecycle hook
    created() {
        SsoUserInfoService.getUserInfo()
            .then((ssoUserInfoResponse: SsoUserInfoResponse) => {
                this.userStore.setSsoUserInfoResponse(ssoUserInfoResponse);
                this.loggedInUser = this.userStore.getName;
            })
            .catch(() => {
                return false;
            });
        this.getFrontendVersion().then((version: string) => {
            this.frontendVersion = version;
        });

        this.getBackendVersion().then((version: string) => {
            this.backendVersion = version;
        });
    }

    private async getFrontendVersion(): Promise<string> {
        return await VersionInfoService.getFrontendInfo()
            .then((frontendInfoResponse: VersionInfoResponse) => {
                return frontendInfoResponse.application.version;
            })
            .catch(() => {
                return "error";
            });
    }

    private async getBackendVersion(): Promise<string> {
        return await VersionInfoService.getBackendInfo()
            .then((backendInfoResponse: VersionInfoResponse) => {
                return backendInfoResponse.application.version;
            })
            .catch(() => {
                return "error";
            });
    }

    suggest(query: string) {
        if (query !== "" && query != null) {
            this.lastSuggestQuery = query;
            SucheService.getSuggestions(query)
                .then((suggestions: SucheComplexSuggestsDTO) => {
                    this.suggestions = [];
                    suggestions.wordSuggests.forEach(
                        (word: SucheWordSuggestDTO) => {
                            this.suggestions.push(
                                new Suggest(
                                    word.text,
                                    this.suggestionTypeVorschlag,
                                    "",
                                    "",
                                    ""
                                )
                            );
                        }
                    );

                    suggestions.zaehlungenSuggests.forEach(
                        (zaehlung: SucheZaehlungSuggestDTO) => {
                            this.suggestions.push(
                                new Suggest(
                                    zaehlung.text,
                                    this.suggestionTypeZaehlung,
                                    zaehlung.zaehlstelleId,
                                    zaehlung.id,
                                    ""
                                )
                            );
                        }
                    );

                    suggestions.zaehlstellenSuggests.forEach(
                        (zaehlstelle: SucheZaehlstelleSuggestDTO) => {
                            this.suggestions.push(
                                new Suggest(
                                    zaehlstelle.text,
                                    this.suggestionTypeZaehlstelle,
                                    zaehlstelle.id,
                                    "",
                                    ""
                                )
                            );
                        }
                    );

                    suggestions.messstellenSuggests.forEach(
                        (messstelle: SucheMessstelleSuggestDTO) => {
                            this.suggestions.push(
                                new Suggest(
                                    messstelle.text,
                                    this.suggestionTypeMessstelle,
                                    "",
                                    "",
                                    messstelle.id
                                )
                            );
                        }
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error));
        } else {
            if (this.lastSuggestQuery !== "" && this.lastSuggestQuery != null) {
                this.lastSuggestQuery = query;
                this.suggestions = [];
            }
        }
    }

    clear() {
        this.searchQuery = "";
        this.selectedSuggestion =
            DefaultObjectCreator.createDefaultSuggestion();
        this.searchStore.setLastSearchQuery(this.searchQuery);
        this.search();
    }

    searchOrShowSelectedSuggestion() {
        if (this.selectedSuggestion == null) {
            this.search();
        } else if (
            this.selectedSuggestion.type === this.suggestionTypeVorschlag
        ) {
            this.searchForSuggestion(this.selectedSuggestion.text);
        } else if (
            this.selectedSuggestion.type === this.suggestionTypeZaehlstelle
        ) {
            this.showZaehlstelle(this.selectedSuggestion);
        } else if (
            this.selectedSuggestion.type === this.suggestionTypeZaehlung
        ) {
            this.showZaehlung(this.selectedSuggestion);
        } else if (
            this.selectedSuggestion.type === this.suggestionTypeMessstelle
        ) {
            this.showMessstelle(this.selectedSuggestion);
        } else {
            this.search();
        }
    }

    private search() {
        if (this.searchQuery == null) {
            this.searchQuery = "";
        }

        this.searchStore.setLastSearchQuery(this.searchQuery);
        if (
            (this.$route.name === "zaehlstelle" ||
                this.$route.name === "messstelle") &&
            this.searchQuery !== ""
        ) {
            this.$router.push(`/`);
        }

        SucheService.searchErhebungsstelle(this.searchQuery)
            .then((result) => {
                this.searchStore.setSearchResult(_.cloneDeep(result));
            })
            .catch((error) => this.snackbarStore.showApiError(error));
    }

    searchForSuggestion(query: string) {
        this.searchQuery = query;
        this.search();
    }

    showZaehlstelle(item: Suggest) {
        this.selectedSuggestion =
            DefaultObjectCreator.createDefaultSuggestion();
        this.$router.push(`/zaehlstelle/${item.zaehlstelleId}`);
    }

    showZaehlung(item: Suggest) {
        this.selectedSuggestion =
            DefaultObjectCreator.createDefaultSuggestion();
        this.$router.push(
            `/zaehlstelle/${item.zaehlstelleId}/${item.zaehlungId}`
        );
    }

    showMessstelle(item: Suggest) {
        this.selectedSuggestion =
            DefaultObjectCreator.createDefaultSuggestion();
        this.$router.push(`/messstelle/${item.mstId}`);
    }

    updateSearchQuery(itemIndex: number) {
        if (itemIndex > -1) {
            this.searchQuery = this.getSuggestions[itemIndex].text;
        }
    }

    deleteChar() {
        this.selectedSuggestion = null;
        this.suggest(this.searchQuery);
    }

    navigateToHandbuch() {
        window.open(App.URL_HANDBUCH_LINK);
    }

    navigateToErhebungsstellenOverview() {
        this.$router.push(`/erhebungsstellenOverview`);
    }

    navigateToConfig() {
        this.$router.push(`/config`);
    }
}
</script>
