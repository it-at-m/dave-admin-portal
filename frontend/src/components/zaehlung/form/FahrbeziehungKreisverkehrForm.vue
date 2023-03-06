<template>
  <v-data-table
      v-model="selectedFahrbeziehungen"
      :headers="headersFahrbeziehungen"
      :items="allPossibleFahrbeziehungen"
      item-key="indexKey"
      key="indexKey"
      show-select
      hide-default-footer
      dense
      fixed-header
      :items-per-page="-1"
      :height="height"
      @toggle-select-all="selectAll"
      @item-selected="selectItem"
  >
    <template v-slot:[`item.hochrechnungsfaktor`]="{ item }">
      <v-autocomplete
          v-if="isHochrechnungsfaktorEditable"
          v-model="item.hochrechnungsfaktor"
          outlined
          :items="hochrechnungsfaktoreDropDown"
          item-text="matrix"
          item-value="matrix"
          return-object
          dense
          required
          single-line
          :disabled="!item.active"
          @change="updateFahrbeziehung(item)"
      ></v-autocomplete>
      <lhm-text-field :text="getHochrechnungsfaktorAsText(item.hochrechnungsfaktor)" v-else/>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import _ from "lodash";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import LhmTextField from "@/components/common/LhmTextField.vue";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";
import FahrbeziehungComparator from "@/util/FahrbeziehungComparator";
/* eslint-enable no-unused-vars */
@Component({
  components: {
    LhmTextField,
    ZaehlungCardMap,
    ZaehlungGeometrie
  }
})
export default class FahrbeziehungKreisverkehrForm extends Vue {

  @Prop()
  private readonly height!: string;

  private fahrbeziehungen: Array<FahrbeziehungDTO> = [];

  private allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];

  mounted() {
    this.updateWorkingCopy();
  }

  get isHochrechnungsfaktorEditable(): boolean {
    return this.$store.getters.isHochrechnungsfaktorEditable;
  }

  get fahrbeziehungStore(): Array<FahrbeziehungDTO> {
    return this.$store.getters.getFahrbeziehungen;
  }

  get knotenarmStore(): Array<KnotenarmDTO> {
    return this.$store.getters.getKnotenarme;
  }

  get hochrechnungsfaktorenStore(): Array<HochrechnungsfaktorDTO> {
    return this.$store.getters.getHochrechnungsfaktoren;
  }

  /**
   * Gibt die im Dropdown anzuzeigenden Hochrechnungsfaktoren zurück.
   * Diese umfassen alle Hochrechnungsfaktoren welche "aktiv" sind.
   *
   * Des Weiteren werden die der Fahrbeziehung zugeordneten Hochrechnungsfaktoren
   * hinzugefügt, falls die den Status "inaktiv" haben.
   * Ansonsten würde dieser inaktive Hochrechnungsfaktoren nicht Eingabefeld angezeigt werden.
   */
  get hochrechnungsfaktoreDropDown(): Array<HochrechnungsfaktorDTO> {
    const dropDown: Array<HochrechnungsfaktorDTO> = [];
    this.hochrechnungsfaktorenStore.forEach((faktor: HochrechnungsfaktorDTO) => {
      if (faktor.active) {
        const copy: HochrechnungsfaktorDTO = _.cloneDeep(faktor);
        dropDown.push(copy);
      }
    })
    // Falls in Fahrbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
    // wird dieser trotzdem dem Dropdown hinzugefügt.
    this.allPossibleFahrbeziehungen.forEach((fahrbeziehung: FahrbeziehungDTO) => {
      if (!_.isNil(fahrbeziehung.hochrechnungsfaktor)
          && !dropDown.includes(fahrbeziehung.hochrechnungsfaktor)) {
        dropDown.push(_.cloneDeep(fahrbeziehung.hochrechnungsfaktor));
      }
    })
    return dropDown;
  }

  @Watch('knotenarmStore', {deep: true, immediate: true})
  updateWorkingCopy(): void {
    this.selectedFahrbeziehungen = [];
    this.allPossibleFahrbeziehungen = _.cloneDeep(this.calculatePossibleFahrbeziehungen());
    this.fahrbeziehungen = _.cloneDeep(this.fahrbeziehungStore);
    this.allPossibleFahrbeziehungen.forEach((pos: FahrbeziehungDTO) => {
      this.fahrbeziehungen.forEach((fahr: FahrbeziehungDTO) => {
        if (pos.knotenarm === fahr.knotenarm && pos.heraus === fahr.heraus && pos.vorbei === fahr.vorbei && pos.hinein === fahr.hinein) {
          pos.hochrechnungsfaktor = _.cloneDeep(fahr.hochrechnungsfaktor);
          if (fahr.id) {
            pos.active = true;
          } else {
            pos.active = fahr.active;
          }
        }
      });
      if(pos.active) {
        this.selectedFahrbeziehungen.push(_.cloneDeep(pos));
      }
    });
  }

  private updateFahrbeziehung(fahrbeziehung: FahrbeziehungDTO): void {
    if (fahrbeziehung.active) {
      // aktualisieren
      this.$store.dispatch("updateFahrbeziehungKreisverkehr", _.cloneDeep(fahrbeziehung));
    } else {
      // löschen
      this.$store.dispatch("deleteFahrbeziehungKreisverkehr", _.cloneDeep(fahrbeziehung));
    }
    this.updateWorkingCopy();
  }

  // private getKey(fz: FahrbeziehungDTO): string {
  //   return `${fz.knotenarm}${fz.hinein}${fz.vorbei}${fz.heraus}`;
  // }

  private getType(fz: FahrbeziehungDTO): string {
    if (fz.hinein) {
      return "in den Kreis";
    } else if (fz.vorbei) {
      return "Vorbeifahrend";
    } else if (fz.heraus) {
      return "aus dem Kreis";
    } else {
      return "unbekannt"
    }
  }

  // private disableCheckboxAndDropDown(fz: FahrbeziehungDTO): boolean {
  //   let vonExists: boolean = false;
  //   this.knotenarmStore.forEach((arm: KnotenarmDTO) => {
  //     vonExists = vonExists || arm.nummer === fz.knotenarm;
  //   })
  //   return !(vonExists);
  // }

  /**
   * Erzeugt aus den vorhandenen Knotenarmen alle möglichen Fahrbeziehungen.
   * @private
   */
  private calculatePossibleFahrbeziehungen(): Array<FahrbeziehungDTO> {
    let standardFaktor: HochrechnungsfaktorDTO = this.$store.getters.getStandardHochrechnungsfaktor;
    let allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];
    this.knotenarmStore.forEach((arm: KnotenarmDTO) => {
      const newFzHeraus: FahrbeziehungDTO = {} as FahrbeziehungDTO;
      newFzHeraus.knotenarm = arm.nummer;
      newFzHeraus.hinein = false;
      newFzHeraus.vorbei = false;
      newFzHeraus.heraus = true;
      newFzHeraus.active = false;
      newFzHeraus.hochrechnungsfaktor = _.cloneDeep(standardFaktor);
      newFzHeraus.kreisverkehrTyp = this.getType(newFzHeraus);
      newFzHeraus.indexKey = `${newFzHeraus.knotenarm}${newFzHeraus.kreisverkehrTyp}`;
      allPossibleFahrbeziehungen.push(newFzHeraus);
      const newFzVorbei: FahrbeziehungDTO = {} as FahrbeziehungDTO;
      newFzVorbei.knotenarm = arm.nummer;
      newFzVorbei.hinein = false;
      newFzVorbei.vorbei = true;
      newFzVorbei.heraus = false;
      newFzVorbei.active = false;
      newFzVorbei.kreisverkehrTyp = this.getType(newFzVorbei);
      newFzVorbei.hochrechnungsfaktor = _.cloneDeep(standardFaktor);
      newFzVorbei.indexKey = `${newFzVorbei.knotenarm}${newFzVorbei.kreisverkehrTyp}`;
      allPossibleFahrbeziehungen.push(newFzVorbei);
      const newFzHinein: FahrbeziehungDTO = {} as FahrbeziehungDTO;
      newFzHinein.knotenarm = arm.nummer;
      newFzHinein.hinein = true;
      newFzHinein.vorbei = false;
      newFzHinein.heraus = false;
      newFzHinein.active = false;
      newFzHinein.kreisverkehrTyp = this.getType(newFzHinein);
      newFzHinein.hochrechnungsfaktor = _.cloneDeep(standardFaktor);
      newFzHinein.indexKey = `${newFzHinein.knotenarm}${newFzHinein.kreisverkehrTyp}`;
      allPossibleFahrbeziehungen.push(newFzHinein);
    });
    allPossibleFahrbeziehungen.sort(FahrbeziehungComparator.sortKreisverkehrByVonAndNach)
    return allPossibleFahrbeziehungen;
  }

  private getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
    return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
  }

  // Neu
  private selectedFahrbeziehungen = new Array<FahrbeziehungDTO>();
  private headersFahrbeziehungen = [
    {
      text: 'Knotenarm',
      align: 'start',
      value: 'knotenarm',
    },
    { text: 'Typ', value: 'kreisverkehrTyp' },
    { text: 'Hochrechnungsfaktor', value: 'hochrechnungsfaktor' },
  ];

  private selectAll(event:any) {
    if(event.items) {
      event.items.forEach((item:FahrbeziehungDTO) => {
        item.active = event.value;
        this.updateFahrbeziehung(item);
      });
    }
  }

  private selectItem(event:any) {
    if(event.item) {
      event.item.active = event.value;
      this.selectedFahrbeziehungen.push(_.cloneDeep(event.item));
      this.updateFahrbeziehung(event.item);
    }
  }
}
</script>