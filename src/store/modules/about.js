import request from '@/utils/request';
const sub_url = '/about';

export const Abouts = {
    state: () => ({
        abouts: undefined,
        about: undefined
    }),
    getters: {},
    mutations: {
        SET_ABOUTS: (state, payload) => {
            state.abouts = payload;
        },
        SET_ABOUT: (state, payload) => {
            state.about = payload;
        }
    },
    actions: {
        getabouts({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .get(sub_url, { params: { ...payload } })
                    .then((res) => {
                        commit('SET_ABOUTS', payload);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        commit('SET_ABOUTS', []);
                        reject(err);
                    });
            });
        },

        getabout({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .get(`${sub_url}/${payload}`)
                    .then((res) => {
                        commit('SET_ABOUT', payload);
                        resolve(res);
                    })
                    .catch((err) => {
                        commit('SET_ABOUT', []);
                        reject(err);
                    });
            });
        },
        // eslint-disable-next-line no-unused-vars
        postabout({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .post(sub_url, { ...payload })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        // eslint-disable-next-line no-unused-vars
        putabout({ commit }, payload) {
            const id = payload.id;
            delete payload.id;
            return new Promise((resolve, reject) => {
                request
                    .put(`${sub_url}/${id}`, { ...payload })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        // eslint-disable-next-line no-unused-vars
        deleteabout({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .delete(`${sub_url}/${payload}`)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
};
