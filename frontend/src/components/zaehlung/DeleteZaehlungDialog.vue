<template>
  <v-dialog
    v-model="showDialog"
    persistent
    width="420px"
  >
    <v-card variant="flat">
      <v-card-title>
        <v-icon
          end
          icon="mdi-calendar-remove"
        />
        {{ DIALOG_TITLE }}
      </v-card-title>

      <v-card-text style="font-weight: normal; font-size: larger">
        {{ dialogtext }}
      </v-card-text>

      <v-card-actions style="justify-content: center">
        <v-btn
          color="tertiary"
          variant="elevated"
          text="Löschen"
          @click="deleteIt()"
        />
        <v-btn
          class="ml-2"
          color="secondary"
          variant="elevated"
          text="Abbrechen"
          @click="cancel()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  dialogtext: string;
}
defineProps<Props>();

const showDialog = defineModel<boolean>({
  required: true,
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "deleteIt"): void;
}>();

const DIALOG_TITLE = "Zählung löschen";

function cancel(): void {
  emits("cancel");
}

function deleteIt(): void {
  emits("deleteIt");
}
</script>
