import { Abouts } from '@/store/modules';
import CRUD from '@/utils/dynamickCrud';
import request from '@/utils/request';
import { createStore } from 'vuex';
<<<<<<< HEAD
const isCrudGenerator = { get: true, put: true, remove: true, getById: true, post: true, state: false, mutation: false, getter: false };
const isLoginGenerator = { get: false, put: false, remove: false, getById: false, post: true, state: false, mutation: false, getter: false };
const isCropAdminGenerator = { get: true, put: false, remove: false, getById: false, post: false, state: false, mutation: false, getter: false };
const isUsefullinfosGenerator = { get: true, put: false, remove: true, getById: false, post: false, state: false, mutation: false, getter: false };
const isCropsCategoryGenerator = { get: true, put: true, remove: true, getById: true, post: true, state: false, mutation: false, getter: false };
=======

const isPost = {post: true };
const isGet = {get: true}
const isPut = {put:true}
const isGetById = {getById: true}
const isDelete = {remove: true}
const isCrudGenerator = { ...isGet, ...isGetById, ...isPost, ...isPut, ...isDelete };
>>>>>>> 36689f0 (fixed)
const store = createStore({
    namespaced: true,
    state() {
    },
    mutations: {
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
<<<<<<< HEAD
                const pageSize = payload.pageSize;
                request
                    .get('/users', { params: { start: (payload.page - 1 || 0) * pageSize, limit: pageSize, populate: '*', filters: payload.filters } })
                    .then((res) => {
                        console.log(res);
                        const meta = {
                            page: payload.page || 1,
                            pageCount: Math.ceil(res.total / pageSize),
=======
                const pageSize = payload.pageSize? +payload.pageSize : 25
                request.get('/users', {params:{start: (payload.page-1||0)*pageSize, limit: pageSize,populate: '*', filters:payload.filters}})
                    .then(res => {
                        const meta ={
                            page: payload.page||1,
                            pageCount: Math.ceil(res.total/pageSize),
>>>>>>> 36689f0 (fixed)
                            pageSize,
                            total: res?.total || 0
                        };
                        resolve({ data: res?.users, meta });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
<<<<<<< HEAD
=======
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
>>>>>>> 36689f0 (fixed)
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
        }
    },
    modules: {
        Abouts,
        login: CRUD('login', isPost, '/auth/local'),
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
        districts: CRUD('districts', isCrudGenerator),
        areas: CRUD('areas', isCrudGenerator),
        areaManagers: CRUD('areaManagers', isCrudGenerator, '/area-managers'),
        drugs: CRUD('drugs', isCrudGenerator),
        distributors: CRUD('distributors', isCrudGenerator),
        drugCategories: CRUD('drugCategories', isCrudGenerator, '/drug-categories'),
        crops: CRUD('crops', isCrudGenerator),
        employeeRoles: CRUD('employeeRoles', isCrudGenerator, '/employee-roles'),
        fertilizers: CRUD('fertilizers', isCrudGenerator),
        fertilizerCategories: CRUD('fertilizerCategories', isCrudGenerator, '/fertilizer-categories'),
        questions: CRUD('questions', isCrudGenerator),
        regions: CRUD('regions', isCrudGenerator),
        seasons: CRUD('seasons', isCrudGenerator),
        units: CRUD('units', isCrudGenerator),
<<<<<<< HEAD
        usefullinfos: CRUD('usefullinfos', isUsefullinfosGenerator)
=======
        usefullinfos: CRUD('usefullinfos', {...isGet, ...isDelete}),
        type: CRUD('type', {...isGet, ...isDelete})
>>>>>>> 36689f0 (fixed)
    }
});
store.hasAction = function (actionName) {
    return !!store._actions[actionName];
};
export default store;
