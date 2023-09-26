<template>
    <v-dialog
        v-model="showDialog"
        persistent
        max-width="50%"
        height="600px"
    >
        <v-card
            width="100%"
            flat
        >
            <v-card-title>
                <v-icon
                    v-if="editZaehlung"
                    left
                    >mdi-calendar-edit</v-icon
                >
                <v-icon
                    v-else
                    left
                    >mdi-calendar-plus</v-icon
                >
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text>
                <zaehlung-form
                    :zaehlstelle="zaehlstelle"
                    @cancel="cancelCreate"
                    @saved="saved"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ZaehlstelleForm from "@/components/zaehlstelle/CreateZaehlstelleForm.vue";
/* eslint-disable no-unused-vars */
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungForm from "@/components/zaehlung/form/ZaehlungForm.vue";
/* eslint-enable no-unused-vars */
@Component({
    components: {
        ZaehlungForm,
        ZaehlstelleForm,
    },
})
export default class ZaehlungDialog extends Vue {
    /**
     * Steuerflag für den Dialog
     */
    @Prop() private showDialog!: boolean;
    @Prop() private zaehlstelle!: ZaehlstelleDTO;

    get editZaehlung(): boolean {
        return this.$store.getters.getZaehlung.id;
    }

    get dialogtitle(): string {
        if (this.editZaehlung) {
            return "Zählung bearbeiten";
        } else {
            return "Neue Zählung anlegen";
        }
    }

    @Watch("showDialog")
    openOrCloseDialog() {
        // value === true, if open
        // value === false, if close
        this.$store.dispatch("setResetformevent", !this.showDialog);
    }

    private cancelCreate(): void {
        this.$emit("cancel");
    }

    private saved(backendIdDTO: BackendIdDTO): void {
        this.$emit("saved", backendIdDTO);
    }
}
</script>