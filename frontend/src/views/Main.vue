<template>
  <v-sheet
      height="100%"
      width="100%"
  >
    <zaehlstelle-map
        height="100%"
        width="100%"
        :zoom="12"
    />
  </v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
@Component({
  components: {ZaehlstelleMap}
})
export default class App extends Vue {

  mounted() {
    window.scrollTo(0, 0);
  }
}
</script>