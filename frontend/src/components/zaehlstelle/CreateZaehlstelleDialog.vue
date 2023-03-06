<template>
  <v-dialog
      v-model="value"
      persistent
      max-width="900px"
  >
    <v-card width="900px" flat>

      <v-card-title>
        <v-icon left>mdi-map-marker-plus-outline</v-icon>
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text>
        <zaehlstelle-form
            :coords="coords"
            @cancel="cancelCreate"
            @saved="saved"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import ZaehlstelleForm from "@/components/zaehlstelle/CreateZaehlstelleForm.vue";
/* eslint-disable no-unused-vars */
import {LatLng} from "leaflet";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
/* eslint-enable no-unused-vars */
@Component({
  components: {ZaehlstelleForm}
})
export default class CreateZaehlstelleDialog extends Vue {
  /**
   * Steuerflag für den Dialog
   */
  @Prop() value!: boolean;
  @Prop({default: DefaultObjectCreator.createCenterOfMunichLatLng()}) coords!: LatLng;

  private dialogtitle: string = "Neue Zählstelle anlegen";

  private cancelCreate(): void {
    this.$emit('cancel');
  }

  private saved(backendIdDTO: BackendIdDTO): void {
    this.$emit('saved', backendIdDTO);
  }
}
</script>
