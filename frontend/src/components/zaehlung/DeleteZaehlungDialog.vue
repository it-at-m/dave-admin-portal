<template>
    <v-dialog
        v-model="showDialog"
        persistent
        width="420px"
    >
        <v-card flat>
            <v-card-title>
                <v-icon left>mdi-calendar-remove</v-icon>
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text style="font-weight: normal; font-size: larger">
                {{ dialogtext }}
            </v-card-text>

            <v-card-actions>
                <v-row no-gutters>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-btn
                            color="grey lighten-1"
                            @click="deleteIt()"
                        >
                            Löschen
                        </v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-btn
                            color="secondary"
                            @click="cancel()"
                        >
                            Abbrechen
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
@Component
export default class DeleteZaehlungDialog extends Vue {
    /**
     * Steuerflag für den Dialog
     */
    @Prop() showDialog!: boolean;
    @Prop() dialogtext!: string;

    dialogtitle = "Zählung löschen";

    cancel(): void {
        this.$emit("cancel");
    }

    deleteIt(): void {
        this.$emit("deleteIt");
    }
}
</script>