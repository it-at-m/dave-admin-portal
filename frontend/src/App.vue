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
                            v-if="item.type === SUGGESTION_TYPE_VORSCHLAG"
                            @click="searchForSuggestion(item.text)"
                        >
                            <v-icon small>mdi-magnify</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === SUGGESTION_TYPE_ZAEHLSTELLE"
                            @click="showZaehlstelle(item)"
                        >
                            <v-icon small>mdi-map-marker</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === SUGGESTION_TYPE_ZAEHLUNG"
                            @click="showZaehlung(item)"
                        >
                            <v-icon small>mdi-counter</v-icon>
                            {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-title
                            v-if="item.type === SUGGESTION_TYPE_MESSSTELLE"
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useUserStore } from "@/store/UserStore";
import SsoUserInfoService from "@/api/service/SsoUserInfoService";
import SsoUserInfoResponse from "@/domain/SsoUserInfoResponse";
import VersionInfoService from "@/api/service/VersionInfoService";
import VersionInfoResponse from "@/domain/VersionInfoResponse";
import { useRoute, useRouter } from "vue-router/composables";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import Suggest from "@/domain/Suggest";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import SucheService from "@/api/service/SucheService";
import SucheComplexSuggestsDTO from "@/domain/dto/suche/SucheComplexSuggestsDTO";
import SucheWordSuggestDTO from "@/domain/dto/suche/SucheWordSuggestDTO";
import SucheZaehlungSuggestDTO from "@/domain/dto/suche/SucheZaehlungSuggestDTO";
import SucheZaehlstelleSuggestDTO from "@/domain/dto/suche/SucheZaehlstelleSuggestDTO";
import SucheMessstelleSuggestDTO from "@/domain/dto/suche/SucheMessstelleSuggestDTO";
import _ from "lodash";
import { useSearchStore } from "@/store/SearchStore";

const URL_HANDBUCH_LINK =
    "https://wilma.muenchen.de/web/senders/af10dc2a-8da5-4d24-815a-b6a9df4c686b/documents/54ddf065-d01f-4965-9bdf-c66ea47927c8";

const loggedInUser = ref("no-security");
const backendVersion = ref("");
const frontendVersion = ref("");

const snackbarStore = useSnackbarStore();
const userStore = useUserStore();
const router = useRouter();

created();

// Lifecycle hook
function created() {
    SsoUserInfoService.getUserInfo()
        .then((ssoUserInfoResponse: SsoUserInfoResponse) => {
            userStore.setSsoUserInfoResponse(ssoUserInfoResponse);
            loggedInUser.value = userStore.getName;
        })
        .catch((error) => {
            snackbarStore.showApiError(error);
            return false;
        });
    VersionInfoService.getFrontendInfo()
        .then((frontendInfoResponse: VersionInfoResponse) => {
            frontendVersion.value = frontendInfoResponse.application.version;
        })
        .catch(() => {
            frontendVersion.value = "error";
        });
    VersionInfoService.getBackendInfo()
        .then((backendInfoResponse: VersionInfoResponse) => {
            backendVersion.value = backendInfoResponse.application.version;
        })
        .catch(() => {
            backendVersion.value = "error";
        });
}

function navigateToHandbuch() {
    window.open(URL_HANDBUCH_LINK);
}

function navigateToErhebungsstellenOverview() {
    router.push(`/erhebungsstellenOverview`);
}

function navigateToConfig() {
    router.push(`/config`);
}

const isFachadmin = computed(() => {
    if (BaseUrlProvider.isDevelopment() && userStore.hasNoAuthorities) {
        return true;
    } else {
        return userStore.isFachadmin;
    }
});

// Wird entfernt bei Hebung auf vue 3
const SUGGESTION_TYPE_VORSCHLAG = "vorschlag";
const SUGGESTION_TYPE_ZAEHLSTELLE = "zaehlstelle";
const SUGGESTION_TYPE_ZAEHLUNG = "zaehlung";
const SUGGESTION_TYPE_MESSSTELLE = "messstelle";
const searchQuery = ref<string>("");
const suggestions = ref<Array<Suggest>>([]);
const selectedSuggestion = ref<Suggest | null>(
    DefaultObjectCreator.createDefaultSuggestion()
);
const lastSuggestQuery = ref("");
const showtooltip = ref(false);

const searchStore = useSearchStore();
const route = useRoute();

const getSuggestions = computed(() => {
    return suggestions.value;
});

function suggest(query: string) {
    if (query !== "" && query != null) {
        lastSuggestQuery.value = query;
        SucheService.getSuggestions(query)
            .then((response: SucheComplexSuggestsDTO) => {
                suggestions.value = [];
                response.wordSuggests.forEach((word: SucheWordSuggestDTO) => {
                    suggestions.value.push(
                        new Suggest(
                            word.text,
                            SUGGESTION_TYPE_VORSCHLAG,
                            "",
                            "",
                            ""
                        )
                    );
                });

                response.zaehlungenSuggests.forEach(
                    (zaehlung: SucheZaehlungSuggestDTO) => {
                        suggestions.value.push(
                            new Suggest(
                                zaehlung.text,
                                SUGGESTION_TYPE_ZAEHLUNG,
                                zaehlung.zaehlstelleId,
                                zaehlung.id,
                                ""
                            )
                        );
                    }
                );

                response.zaehlstellenSuggests.forEach(
                    (zaehlstelle: SucheZaehlstelleSuggestDTO) => {
                        suggestions.value.push(
                            new Suggest(
                                zaehlstelle.text,
                                SUGGESTION_TYPE_ZAEHLSTELLE,
                                zaehlstelle.id,
                                "",
                                ""
                            )
                        );
                    }
                );

                response.messstellenSuggests.forEach(
                    (messstelle: SucheMessstelleSuggestDTO) => {
                        suggestions.value.push(
                            new Suggest(
                                messstelle.text,
                                SUGGESTION_TYPE_MESSSTELLE,
                                "",
                                "",
                                messstelle.id
                            )
                        );
                    }
                );
            })
            .catch((error) => snackbarStore.showApiError(error));
    } else {
        if (lastSuggestQuery.value !== "" && lastSuggestQuery.value != null) {
            lastSuggestQuery.value = query;
            suggestions.value = [];
        }
    }
}

function clear() {
    searchQuery.value = "";
    selectedSuggestion.value = DefaultObjectCreator.createDefaultSuggestion();
    searchStore.setLastSearchQuery(searchQuery.value);
    search();
}

function searchOrShowSelectedSuggestion() {
    if (selectedSuggestion.value == null) {
        search();
    } else if (selectedSuggestion.value.type === SUGGESTION_TYPE_VORSCHLAG) {
        searchForSuggestion(selectedSuggestion.value.text);
    } else if (selectedSuggestion.value.type === SUGGESTION_TYPE_ZAEHLSTELLE) {
        showZaehlstelle(selectedSuggestion.value);
    } else if (selectedSuggestion.value.type === SUGGESTION_TYPE_ZAEHLUNG) {
        showZaehlung(selectedSuggestion.value);
    } else if (selectedSuggestion.value.type === SUGGESTION_TYPE_MESSSTELLE) {
        showMessstelle(selectedSuggestion.value);
    } else {
        search();
    }
}

function search() {
    if (searchQuery.value == null) {
        searchQuery.value = "";
    }

    searchStore.setLastSearchQuery(searchQuery.value);
    if (
        (route.name === "zaehlstelle" || route.name === "messstelle") &&
        searchQuery.value !== ""
    ) {
        router.push(`/`);
    }

    SucheService.searchErhebungsstelle(searchQuery.value)
        .then((result) => {
            searchStore.setSearchResult(_.cloneDeep(result));
        })
        .catch((error) => snackbarStore.showApiError(error));
}

function searchForSuggestion(query: string) {
    searchQuery.value = query;
    search();
}

function showZaehlstelle(item: Suggest) {
    selectedSuggestion.value = DefaultObjectCreator.createDefaultSuggestion();
    router.push(`/zaehlstelle/${item.zaehlstelleId}`);
}

function showZaehlung(item: Suggest) {
    selectedSuggestion.value = DefaultObjectCreator.createDefaultSuggestion();
    router.push(`/zaehlstelle/${item.zaehlstelleId}/${item.zaehlungId}`);
}

function showMessstelle(item: Suggest) {
    selectedSuggestion.value = DefaultObjectCreator.createDefaultSuggestion();
    router.push(`/messstelle/${item.mstId}`);
}

function updateSearchQuery(itemIndex: number) {
    if (itemIndex > -1) {
        searchQuery.value = getSuggestions.value[itemIndex].text;
    }
}

function deleteChar() {
    selectedSuggestion.value = null;
    suggest(searchQuery.value);
}
</script>