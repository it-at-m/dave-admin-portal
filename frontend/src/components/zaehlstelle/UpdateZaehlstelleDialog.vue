<template>
    <v-dialog
        v-model="value"
        persistent
        max-width="900px"
    >
        <v-card
            width="900px"
            flat
        >
            <v-card-title>
                <v-icon left>mdi-map-marker-plus-outline</v-icon>
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text>
                <update-zaehlstelle-form
                    :zaehlstelle="zaehlstelle"
                    @cancel="cancelCreate"
                    @saved="saved"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
/* eslint-enable no-unused-vars */
import UpdateZaehlstelleForm from "@/components/zaehlstelle/UpdateZaehlstelleForm.vue";

@Component({
    components: { UpdateZaehlstelleForm },
})
export default class UpdateZaehlstelleDialog extends Vue {
    /**
     * Steuerflag für den Dialog
     */
    @Prop() value!: boolean;
    @Prop() zaehlstelle!: ZaehlstelleDTO;

    private dialogtitle = "Zählstelle bearbeiten";

    private cancelCreate(): void {
        this.$emit("cancel");
    }

    private saved(): void {
        this.$emit("saved");
    }
}
</script>
