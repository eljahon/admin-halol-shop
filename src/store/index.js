import { Abouts, Chats } from '@/store/modules';
import CRUD from '@/utils/dynamickCrud';
import request from '@/utils/request';
import { createStore } from 'vuex';
// import { useToast } from 'primevue/usetoast';
// import { useI18n } from 'vue-i18n';

const isPost = { post: true };
const isGet = { get: true };
const isPut = { put: true };
const isGetById = { getById: true };
const isDelete = { remove: true };
const isCrudGenerator = { ...isGet, ...isGetById, ...isPost, ...isPut, ...isDelete };
const store = createStore({
    namespaced: true,
    state: {
        errorStatus: null,
        configSettings: null,
    },
    getters: {
        getErrorStatus: (state) => state.errorStatus,
        getConfigSettings: (state) => state.configSettings
    },
    mutations: {
        ERROR(state, payload) {
            state.errorStatus = payload;
        },
        SET_CONFIG_SETTINGS(state, payload) {
            state.configSettings = payload;
        }
    },
    actions: {
        uploadFile(ctx, payload) {
            return new Promise((resolve, reject) => {
                request
                    .post(
                        '/upload/custom_upload',
                        { ...payload.data },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data' // Explicitly set the Content-Type
                            },
                            params: {
                                folder: payload.folder
                            }
                        }
                    )
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        uploadFileEditor({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .post(
                        '/upload/custom_upload',
                        { ...payload.data },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            params: {
                                folder: payload.folder,
                                type: payload?.type ?? undefined
                            }
                        }
                    )
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const pageSize = payload?.pageSize ? +payload.pageSize : 10;
                request
                    .get('/users', { params: { start: (payload?.page - 1 || 0) * pageSize, limit: pageSize, populate: '*', filters: payload.filters } })
                    .then((res) => {
                        const meta = {
                            page: payload?.page || 1,
                            pageCount: Math.ceil(res.total / pageSize),
                            pageSize,
                            total: res?.total || 0
                        };
                        console.log(meta);
                        resolve({ data: res?.users, meta });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getLandMonitoring({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .get('/field/coordinates', { params: { ...payload } })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getByIdUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .get(`/users/${payload}`, { params: { populate: '*' } })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        postUsers({ commit }, paylad) {
            return new Promise((resolve, reject) => {
                request
                    .post('/users', { ...paylad })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        putUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .put(`/users/${payload.id}`, { ...payload.data })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        putMainIfo({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .put(`/main-info`, { ...payload })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        deleteUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .delete(`/users/${payload}`)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        async productReject(payload) {
            return await request.patch(`/product/reject/${payload.id}`);
        },
        error({ commit }, paload) {
            // console.log(paload);
            commit('ERROR', paload);
            // const toast = useToast()
            // const {t} = useI18n()
            // toast.add({ severity: 'error', summary: t('user'), detail: t('user') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        },
        async productConfirmed({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .patch(`/product/check/${payload.id}`)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        async getAnalytics(params) {
            try {
                const data = await request.get('/all/statistics', params);
                return data;
            } catch (err) {
                throw Error(err);
            }
        },
        getUserMe() {
            return new Promise((resolve, reject) => {
                request
                    .get('/me')
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        async getRoles(params) {
            const roles = await request.get('/users-permissions/roles');
            // console.log(roles);
            return roles.roles;
        },
        async getConfig({ commit }) {
            const data = await request.get('/json/config');
            commit('SET_CONFIG_SETTINGS', data)
            // console.log(roles);
            return data
        }
    },
    modules: {
        Abouts,
        Chats,
        login: CRUD('login', isPost, '/auth/login/regular'),
        aboutUs: CRUD('aboutUs', isCrudGenerator, '/aboutus'),
        products: CRUD('products', isCrudGenerator, '/product'),
        companies: CRUD('companies', isCrudGenerator, '/company'),
        category: CRUD('category', isCrudGenerator, '/category'),
        staticsBasic: CRUD('staticsBasic',isGet, `/statics/basic`),
        // category: CRUD('staticsBasic',isGet, `/category`),
        user: CRUD('user',isGet, `/user`),
        configSettings: CRUD('configSettings',isGet, `/json/config`),
        // cropAdmin: CRUD('cropAdmin', isGet, '/admin/crops'),
        // newChats: CRUD('newChats', isGet, '/new/chats'),

    }
});
store.hasAction = function (actionName) {
    return !!store._actions[actionName];
};
export default store;
