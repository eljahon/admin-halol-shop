import axios_init from '@/utils/request';
import { camelize } from '@/utils/index';

export default function (param, isStoreAndMethods, url) {
    // param = 'crops'
    const toUpper = param.toUpperCase();
    // const _param = param.split('-').length > 1 ? param.split('/').slice(-1)[0] : param
    const _param = param;
    const _mutations = {
        // toUpper = 'CROPS'
        error: `ERROR_${toUpper}`,
        load: `LOAD_${toUpper}`,
        oneLoad: `ONE_LOAD_${toUpper}`,
        pending: `PENDING_${toUpper}`,
        deleting: `DELETING_${toUpper}`,
        data: `GET_${toUpper}`,
        pagination: `PAGINATION_${toUpper}`,
        removeOne: `REMOVE_ONE_${toUpper}`
    };
    const { get = true, getById = true, put = true, post = true, remove = true, state = true, getter = true, mutation = true } = isStoreAndMethods;
    const fullStore = { actions: {}, state: {}, getters: {}, mutations: {} };
    if (state)
        fullStore.state = {
            loading: false,
            oneLoading: false,
            pending: false,
            deleting: false,
            error: null,
            data: [],
            pagination: {
                page: 1,
                pageSize: 15,
                from: 0,
                to: 0,
                total: 0
            }
        };
    if (getter)
        fullStore.getters = {
            [camelize(`load ${_param}`)]: function (state) {
                return state.loading;
            },
            [camelize(`one load ${_param}`)]: function (state) {
                return state.oneLoading;
            },
            [camelize(`pending ${_param}`)]: function (state) {
                return state.pending;
            },
            [camelize(`deleting ${_param}`)]: function (state) {
                return state.deleting;
            },
            [camelize(`data ${_param}`)]: function (state) {
                return state.data;
            },
            [camelize(`error ${_param}`)]: function (state) {
                return state.error;
            },
            [camelize(`pagination ${_param}`)]: function (state) {
                return state.pagination;
            }
        };
    if (mutation)
        fullStore.mutations = {
            [_mutations.error]: function (state, payload) {
                state.error = payload;
            },
            [_mutations.data]: function (state, payload) {
                state.data = payload;
            },
            [_mutations.load]: function (state, payload) {
                state.loading = payload;
            },
            [_mutations.oneLoad]: function (state, payload) {
                state.oneLoading = payload;
            },
            [_mutations.pending]: function (state, payload) {
                state.pending = payload;
            },
            [_mutations.deleting]: function (state, payload) {
                state.deleting = payload;
            },
            [_mutations.pagination]: function (state, payload) {
                state.pagination = payload;
            },
            [_mutations.removeOne]: function (state, payload) {
                state.data.splice(payload, 1);
            }
        };
    if (get)
        fullStore.actions[camelize(`get ${_param}`)] = function ({ commit, state }, params) {
            return new Promise((resolve, reject) => {
                axios_init
                    .get(`${url ?? param}`, {params})
                    .then((res) => {
                        if (res.meta && params?.pagination) {
                            const { page, total, pageSize } = res.meta.pagination;
                            const _paginationData = {
                                page: page,
                                pageSize: pageSize,
                                // from: (page - 1) * pageSize + 1,
                                // to: page * pageSize > total ? total : page * pageSize,
                                total: total
                            };
                            // commit(_mutations.pagination, _paginationData);
                        }
                        const { page, total, pageSize } = res.meta.pagination;
                        const _res = {data: res.data || [], meta:{page, total, pageSize}};
                        // commit(_mutations.data, _res);
                        resolve(_res);
                    })
                    .catch((error) => {
                        commit(_mutations.error, error);
                        reject(error);
                    })
                    .finally(() => {
                        // commit(_mutations.load, false);
                    });
            });
        };
    if (getById)
        fullStore.actions[camelize(`get by id ${_param}`)] = function ({ commit }, payload) {
            return new Promise((resolve, reject) => {
                axios_init
                    .get(`${param}/${payload.id}`, {params:payload.query})
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                    .finally(() => {
                        // commit(_mutations.oneLoad, false);
                    });
            });
        };
    if (post)
        fullStore['actions'][camelize(`post ${_param}`)] = function ({ commit, dispatch }, payload) {
            if(mutation) commit(_mutations.pending, true);
            return new Promise((resolve, reject) => {
                axios_init
                    .post(`${url ?? param}`, { ...payload })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                    .finally(() => {
                        // commit(_mutations.pending, false);
                    });
            });
        };
    if (put)
        fullStore['actions'][camelize(`put ${_param}`)] = function ({ commit, dispatch }, payload) {
            // commit(_mutations.pending, true);
            return new Promise((resolve, reject) => {
                axios_init
                    .put(`${url ?? param}/${payload.id}`, { data: payload.data })
                    .then((res) => {
                        // dispatch('success_alert', {
                        //     title: `${_param.slice(0, 1).toUpperCase() + _param.slice(1)} updated successfully`
                        // });
                        resolve(res);
                    })
                    .catch((error) => {
                        // commit(_mutations.error, error)
                        reject(error);
                    })
                    .finally(() => {
                        // commit(_mutations.pending, false);
                    });
            });
        };
    if (remove)
        fullStore['actions'][camelize(`delete ${_param}`)] = function ({ commit, dispatch }, payload) {
            commit(_mutations.deleting, true);
            return new Promise((resolve, reject) => {
                axios_init
                    .delete(`${url ?? param}/${payload}`)
                    .then((res) => {
                        // dispatch('success_alert', {
                        //     title: `${_param.slice(0, 1).toUpperCase() + _param.slice(1)} deleted successfully`
                        // });
                        resolve(res);
                    })
                    .catch((error) => {
                        // commit(_mutations.error, error)
                        reject(error);
                    })
                    .finally(() => {
                        // commit(_mutations.deleting, false);
                    });
            });
        };
    return fullStore;
}
