<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row no-gutters>
        <div style="align-self: center">
          <v-avatar :color="statusDesign.color"
                    size="50">
            <v-icon large dense>{{ statusDesign.iconPath }}</v-icon>
          </v-avatar>
        </div>
        <div style="font-size: x-large; align-self: center" class="pl-5">
          {{ header }}
        </div>
        <v-spacer/>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="mt-1">
      <v-list>
        <v-list-item
            v-for="(zaehlung, index) in zaehlungen"
            :key="index"
            @click="openZaehlung(zaehlung)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="getItemTitle(zaehlung)"/>
            <v-list-item-subtitle v-text="getItemSubtitle(zaehlung)"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

// Typen
/* eslint-disable no-unused-vars */
import IconOptions from "@/components/icons/IconOptions";
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import {zaehlartText} from "@/domain/enums/Zaehlart";
/* eslint-enable no-unused-vars */

@Component
export default class OpenZaehlungPanel extends Vue {

  @Prop() header!: string;

  @Prop() statusDesign!: IconOptions;

  @Prop() zaehlungen!: Array<OpenZaehlungDTO>;

  private getItemTitle(zaehlung: OpenZaehlungDTO) {
    return `Zählung vom ${this.$d(new Date(zaehlung.datum), 'short', 'de-DE')} an Zählstelle ${zaehlung.zaehlstellenNummer} in ${zaehlung.stadtbezirk}`;
  }

  private getItemSubtitle(zaehlung: OpenZaehlungDTO) {
    return `Projektnummer: ${zaehlung.projektNummer}, Projektname: ${zaehlung.projektName}, Zählart: ${zaehlartText.get(zaehlung.zaehlart)}`;
  }

  private openZaehlung(zaehlung: OpenZaehlungDTO): void {
    this.$router.push(`/zaehlstelle/${zaehlung.zaehlstellenId}/${zaehlung.id}`);
  }
}
</script>