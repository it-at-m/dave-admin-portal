export default {
  state: {
    changetabevent: 0,
    resetformevent: false,
    resetNotificationsEvent: 0,
  },
  getters: {
    getChangetabevent: (state: any) => {
      return state.changetabevent;
    },
    getResetformevent: (state: any) => {
      return state.resetformevent;
    },
    getResetNotificationsEvent: (state: any) => {
      return state.resetNotificationsEvent;
    }
  },
  mutations: {
    changetabevent(state: any, payload: number) {
      state.changetabevent = payload;
    },
    resetformevent(state: any, payload: boolean) {
      state.resetformevent = payload;
    },
    resetNotificationsEvent(state: any) {
      state.resetNotificationsEvent++;
    }
  },
  actions: {
    setChangetabevent(context: any, payload: number) {
      context.commit('changetabevent', payload)
    },
    setResetformevent(context: any, payload: boolean) {
      context.commit('resetformevent', payload)
    },
    triggerResetNotificationsEvent(context: any) {
      context.commit('resetNotificationsEvent');
    }
  }
}