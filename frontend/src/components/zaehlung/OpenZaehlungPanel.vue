<template>
    <v-expansion-panel>
        <v-expansion-panel-header>
            <v-row no-gutters>
                <div style="align-self: center">
                    <v-avatar
                        :color="statusDesign.color"
                        size="50"
                    >
                        <v-icon
                            large
                            dense
                            >{{ statusDesign.iconPath }}</v-icon
                        >
                    </v-avatar>
                </div>
                <div
                    style="font-size: x-large; align-self: center"
                    class="pl-5"
                >
                    {{ header }}
                </div>
                <v-spacer />
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mt-1">
            <v-list>
                <v-list-item
                    v-for="(zaehlung, index) in zaehlungen"
                    :key="index"
                    @click="openZaehlung(zaehlung)"
                >
                    <!--eslint-disable vue/no-v-text-v-html-on-component-->
                    <v-list-item-content>
                        <v-list-item-title v-text="getItemTitle(zaehlung)" />
                        <v-list-item-subtitle
                            v-text="getItemSubtitle(zaehlung)"
                        />
                    </v-list-item-content>
                    <!--eslint-enable vue/no-v-text-v-html-on-component-->
                </v-list-item>
            </v-list>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script setup lang="ts">
import IconOptions from "@/components/icons/IconOptions";
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import i18n from "@/i18n";
import { zaehlartText } from "@/domain/enums/Zaehlart";
import { useRouter } from "vue-router/composables";

interface Props {
    header: string;
    statusDesign: IconOptions;
    zaehlungen: Array<OpenZaehlungDTO>;
}

defineProps<Props>();

const router = useRouter();
function getItemTitle(zaehlung: OpenZaehlungDTO) {
    return `Zählung vom ${i18n.d(
        new Date(zaehlung.datum),
        "short",
        "de-DE"
    )} an Zählstelle ${zaehlung.zaehlstellenNummer} in ${zaehlung.stadtbezirk}`;
}

function getItemSubtitle(zaehlung: OpenZaehlungDTO) {
    return `Projektnummer: ${zaehlung.projektNummer}, Projektname: ${
        zaehlung.projektName
    }, Zählart: ${zaehlartText.get(zaehlung.zaehlart)}`;
}

function openZaehlung(zaehlung: OpenZaehlungDTO): void {
    router.push(`/zaehlstelle/${zaehlung.zaehlstellenId}/${zaehlung.id}`);
}
</script>