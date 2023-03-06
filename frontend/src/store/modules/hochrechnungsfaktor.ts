import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const state = {
  hochrechnungsfaktoren: []
}

const getters = {
  getHochrechnungsfaktoren(state: any): Array<HochrechnungsfaktorDTO> {
    return state.hochrechnungsfaktoren;
  },
  getStandardHochrechnungsfaktor(state: any): HochrechnungsfaktorDTO {
    let standardFaktor: HochrechnungsfaktorDTO = DefaultObjectCreator.createDefaultHochrechnungsfaktor();
    state.hochrechnungsfaktoren.forEach((faktor: HochrechnungsfaktorDTO) => {
      if (faktor.defaultFaktor) {
        standardFaktor = faktor;
      }
    });
    return standardFaktor;
  },
}

const mutations = {
  setHochrechnungsfaktoren(state: any, payload: Array<HochrechnungsfaktorDTO>) {
    state.hochrechnungsfaktoren = payload;
  },
  addHochrechnungsfaktor(state: any, payload: HochrechnungsfaktorDTO) {
    state.hochrechnungsfaktoren.push(payload);
  },
  deleteHochrechnungsfaktor(state: any, payload: HochrechnungsfaktorDTO) {
    let containsMatrix: boolean = false;
    let toDelete: HochrechnungsfaktorDTO | null = null;
    // Zu löschendes Element suchen
    state.hochrechnungsfaktoren.forEach((faktor: HochrechnungsfaktorDTO) => {
      if (faktor.matrix === payload.matrix) {
        toDelete = faktor;
      }
      containsMatrix = containsMatrix || (faktor.matrix === payload.matrix);
    })
    // Wenn das Element existiert, wird dieses aus dem Array entfernt
    if (containsMatrix) {
      let index: number = state.hochrechnungsfaktoren.indexOf(toDelete);
      if (index > -1) {
        state.hochrechnungsfaktoren.splice(index, 1);
      }
    }
  },
  updateHochrechnungsfaktor(state: any, payload: HochrechnungsfaktorDTO) {
    let containsMatrix: boolean = false;
    let toDelete: HochrechnungsfaktorDTO | null = null;
    // Zu aktualisierendes Element suchen
    state.hochrechnungsfaktoren.forEach((faktor: HochrechnungsfaktorDTO) => {
      if (faktor.matrix === payload.matrix) {
        toDelete = faktor;
      }
      containsMatrix = containsMatrix || (faktor.matrix === payload.matrix);
    })
    // Wenn das Element existiert, wird dieses im Array durch das aktualisierte Element ersetzt
    if (containsMatrix) {
      let index: number = state.hochrechnungsfaktoren.indexOf(toDelete);
      if (index > -1) {
        state.hochrechnungsfaktoren[index] = payload;
      }
    }
  }
}

const actions = {
  setHochrechnungsfaktoren(context: any, payload: Array<HochrechnungsfaktorDTO>) {
    context.commit("setHochrechnungsfaktoren", payload);
  },
  addHochrechnungsfaktor(context: any, payload: HochrechnungsfaktorDTO) {
    context.commit("addHochrechnungsfaktor", payload);
  },
  updateHochrechnungsfaktor(context: any, payload: HochrechnungsfaktorDTO) {
    context.commit("updateHochrechnungsfaktor", payload);
  },
  deleteHochrechnungsfaktor(context: any, payload: HochrechnungsfaktorDTO) {
    context.commit("deleteHochrechnungsfaktor", payload);
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}