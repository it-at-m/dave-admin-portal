<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    class="overflow-y-auto overflow-x-hidden"
  >
    <v-card
      width="100%"
      :height="height"
      :max-height="height"
      variant="flat"
    >
      <v-card-text class="pb-16">
        <template v-if="configItems.length">
          <div v-for="(items, category) in groupedConfig" :key="category" class="mb-6">
            <h3 class="text-h6 mb-3">{{ category.toUpperCase() }}</h3>
            <v-list>
              <v-list-item v-for="item in items" :key="item.id">
                <v-text-field
                  :label="item.keyname"
                  v-model="item.valuefield"
                  variant="outlined"
                  density="compact"
                  class="pt-2"
                  :rules="[validateDatatype(item)]"
                />
              </v-list-item>
            </v-list>
          </div>
        </template>
        <template v-else>
          <p>Keine Konfigurationselemente gefunden.</p>
        </template>
      </v-card-text>
      <v-card-actions style="position: absolute; bottom: 0; right: 0">
        <v-spacer></v-spacer>
        <v-btn
          text="Speichern"
          color="secondary"
          variant="elevated"
          @click="saveConfigValues"
        />
      </v-card-actions>        
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import ConfigurationService from '@/api/service/ConfigurationService';
import { useSnackbarStore } from "@/store/SnackbarStore";
import type ConfigurationItemDTO from '@/types/configuration/ConfigurationItemDTO';

const snackbarStore = useSnackbarStore();

const configItems = ref<ConfigurationItemDTO[]>([]);

const groupedConfig = computed(() => {
  return configItems.value.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, ConfigurationItemDTO[]>);
});

function validateDatatype(item: ConfigurationItemDTO) {
  return (value: string) => {
    if (!value) return true;
    if (item.datatype === 'INTEGER') {
      return /^-?\d+$/.test(value) || 'Muss eine Ganzzahl sein';
    }
    if (item.datatype === 'DOUBLE') {
      return /^-?\d+(\.\d+)?$/.test(value) || 'Muss eine Zahl sein';
    }
    if (item.datatype === 'BOOLEAN') {
      return /^(true|false)$/i.test(value) || 'Muss true oder false sein';
    }
    return true;
  };
}

loadConfigValues();

function loadConfigValues() {
  ConfigurationService.getAllConfigurationValues().then((response) => {
    configItems.value = response;
  }).catch((error) => {
    snackbarStore.showError('Fehler beim Laden der Konfiguration', error);
  });
}

function saveConfigValues() {
  ConfigurationService.saveConfiguration(configItems.value).then(() => {
    loadConfigValues();
  }).catch((error) => {
    snackbarStore.showError('Fehler beim Speichern der Konfiguration', error);
  });
}

interface Props {
  height: string;
}
defineProps<Props>();

</script>
