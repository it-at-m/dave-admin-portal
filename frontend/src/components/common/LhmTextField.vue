<template>
    <div>
        <span
            v-if="showCaption"
            class="text-caption"
            >{{ caption }}</span
        ><br />
        <span class="text text-info">{{ text }}</span
        ><br /><br v-if="fahrbeziehung" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LhmTextField extends Vue {
    @Prop({ default: "" }) readonly caption!: string;
    @Prop({ default: "" }) readonly text!: string;
    @Prop({ default: false }) readonly fahrbeziehung?: boolean;

    get showCaption(): boolean {
        return this.caption !== "";
    }
}
</script>

<style scoped>
.text-info {
    font-size: 18px;
    color: black;
}
</style>
