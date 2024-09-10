import { Abouts } from '@/store/modules';
import CRUD from '@/utils/dynamickCrud';
import request from '@/utils/request';
import { createStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';


const isPost = {post: true };
const isGet = {get: true}
const isPut = {put:true}
const isGetById = {getById: true}
const isDelete = {remove: true}
const isCrudGenerator = { ...isGet, ...isGetById, ...isPost, ...isPut, ...isDelete };
const store = createStore({
    namespaced: true,
    state: {
        errorStatus: null
    },
    mutations: {
        ERROR(state, payload){
            state.errorStatus = payload
        }
    },
    actions: {
        uploadFile({ commit }, payload) {
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
        getUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const pageSize = payload?.pageSize? +payload.pageSize : 25
                request.get('/users', {params:{start: (payload?.page-1||0)*pageSize, limit: pageSize,populate: '*', filters:payload.filters}})
                    .then(res => {
                        const meta ={
                            page: payload?.page||1,
                            pageCount: Math.ceil(res.total/pageSize),
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
                request.get('/field/coordinates', {params: {...payload}})
                    .then(res => {

                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getByIdUsers({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request.get(`/users/${payload}`, {params:{populate: '*'}})
                    .then(res => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        postUsers({commit}, paylad) {
            return new Promise((resolve, reject) => {
                request.post('/users', {...paylad})
                    .then(res => {
                    resolve(res)
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        putUsers({commit}, payload) {
            return new Promise((resolve, reject) => {
                request.put(`/users/${payload.id}`, {...payload.data})
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        deleteUsers ({commit}, payload) {
            return new Promise((resolve, reject) => {
                request.delete(`/users/${payload}`)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        error({commit}, paload){
            commit('ERROR', paload)
            // const toast = useToast()
            // const {t} = useI18n()
            // toast.add({ severity: 'error', summary: t('user'), detail: t('user') + ' ' + values.id ? t('update') : t('create'), life: 3000 });

        },
        async productConfirmed({commit},payload) {
            return new Promise((resolve, reject) => {
                request.patch(`/product/check/${payload.id}`)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }) ;
        },
        async  getAnalytics (params) {
            try{
                const data = await request.get('/all/statistics', params)
                return data;
            } catch(err) {
                throw Error(err)
            }
        },
        getUserMe() {
            return new Promise((resolve, reject) => {
                request
                    .get('/users/me')
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
    },
    modules: {
        Abouts,
        login: CRUD('login', isPost, '/auth/local'),
        // landMonitoring: CRUD('landMonitoring', isGet, ''),
        products: CRUD('products', isCrudGenerator),
        cropAdmin: CRUD('cropAdmin', isGet, '/admin/crops'),
        cropsCategory: CRUD('cropsCategory', isCrudGenerator, '/crop-categories'),
        activityTypes: CRUD('activityTypes', isCrudGenerator, '/activity-types'),
        farmers: CRUD('farmers', isCrudGenerator),
        chatStatistics: CRUD('chatStatistics', isGet,'/chat/statistics'),
        companies: CRUD('companies', isGet),
        treatments: CRUD('treatments', isCrudGenerator),
        fertilizations: CRUD('fertilizations', isCrudGenerator),
        diseases: CRUD('diseases', isCrudGenerator),
        drugCategories: CRUD('drugCategories', isCrudGenerator, '/drug-categories'),
        diseasesType: CRUD('diseasesType', isCrudGenerator, '/diseases/type'),
        diseasesCategoriesTree: CRUD('diseasesCategoriesTree', isCrudGenerator, '/disease-categories', 'tree'),
        diseasesCategories: CRUD('diseasesCategories', isCrudGenerator, '/disease-categories'),
        genders: CRUD('genders', isCrudGenerator),
        // users: CRUD('users', isCrudGenerator),
        districts: CRUD('districts', isCrudGenerator),
        areas: CRUD('areas', isCrudGenerator),
        areaManagers: CRUD('areaManagers', isCrudGenerator, '/area-managers'),
        drugs: CRUD('drugs', isCrudGenerator),
        distributors: CRUD('distributors', isCrudGenerator),
        // drugCategories: CRUD('drugCategories', isCrudGenerator, '/drug-categories'),
        crops: CRUD('crops', isCrudGenerator),
        employeeRoles: CRUD('employeeRoles', isCrudGenerator, '/employee-roles'),
        fertilizers: CRUD('fertilizers', isCrudGenerator),
        fertilizerCategories: CRUD('fertilizerCategories', isCrudGenerator, '/fertilizer-categories'),
        questions: CRUD('questions', isCrudGenerator),
        employees: CRUD('employees', isCrudGenerator),
        regions: CRUD('regions', isCrudGenerator),
        seasons: CRUD('seasons', isCrudGenerator),
        units: CRUD('units', isCrudGenerator),
        usefullinfos: CRUD('usefullinfos', {...isGet, ...isDelete}),
        type: CRUD('type', {...isGet, ...isDelete})
    }
});
store.hasAction = function (actionName) {
    return !!store._actions[actionName];
};
export default store;
