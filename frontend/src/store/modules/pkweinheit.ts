import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";

const state = {
    pkwEinheit: {} as PkwEinheitDTO,
};

const getters = {
    getPkwEinheit(state: any) {
        return state.pkwEinheit;
    },
};

const mutations = {
    setPkwEinheit(state: any, payload: PkwEinheitDTO) {
        state.pkwEinheit = payload;
    },
};

const actions = {
    setPkwEinheit(context: any, payload: PkwEinheitDTO) {
        context.commit("setPkwEinheit", payload);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
