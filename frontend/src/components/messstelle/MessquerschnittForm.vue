<template>
  <v-sheet
    width="100%"
    :min-height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-card elevation="0">
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="selectedMessquerschnitt"
              variant="outlined"
              :items="messstelle.messquerschnitte"
              item-title="mqId"
              return-object
              density="compact"
              label="ID Messquerschnitt"
            ></v-autocomplete>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <lhm-text-field
              :text="selectedMessquerschnitt.strassenname"
              caption="Straßenname"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <lhm-text-field
              :text="
                himmelsRichtungenTextLong.get(
                  selectedMessquerschnitt.fahrtrichtung
                )
              "
              caption="Fahrtrichtung"
            />
          </v-col>
          <v-spacer />
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <lhm-text-field
              :text="selectedMessquerschnitt.lageMessquerschnitt"
              caption="Lage Messquerschnitt"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <lhm-text-field
              :text="`${selectedMessquerschnitt.anzahlFahrspuren}`"
              caption="Anzahl Fahrstreifen"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <lhm-text-field
              :text="`${selectedMessquerschnitt.anzahlDetektoren}`"
              caption="Anzahl Detektoren"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="selectedMessquerschnitt.standort"
              :rules="[validationUtils.pflichtfeld]"
              label="Standort MQ"
              variant="outlined"
              density="compact"
              rows="2"
              row-height="10"
              counter="60"
              maxlength="60"
              :disabled="disabled"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import type MessstelleEditDTO from "@/types/messstelle/MessstelleEditDTO";

import { onMounted, ref, watch } from "vue";

import LhmTextField from "@/components/common/LhmTextField.vue";
import { useEventbus } from "@/store/Eventbus";
import { himmelsRichtungenTextLong } from "@/types/enum/Himmelsrichtungen";
import { useValidationUtils } from "@/util/validationUtils";

const validationUtils = useValidationUtils();

interface Props {
  height: string;
  disabled: boolean;
}

defineProps<Props>();
const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
});

const eventbus = useEventbus();

const selectedMessquerschnitt = ref(messstelle.value.messquerschnitte[0]);

onMounted(() => {
  initSelectedMessquerschnitt();
});

watch(
  () => eventbus.getReloadEvent,
  () => {
    initSelectedMessquerschnitt();
  }
);

function initSelectedMessquerschnitt() {
  selectedMessquerschnitt.value = messstelle.value.messquerschnitte[0];
}
</script>
