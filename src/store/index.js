import { Abouts } from '@/store/modules';
import CRUD from '@/utils/dynamickCrud';
import request from '@/utils/request';
import { createStore } from 'vuex';
import { palette } from '@primevue/themes';
const isCrudGenerator = { get: true, put: true, remove: true, getById: true, post: true, state: false, mutation: false, getter: false };
const isLoginGenerator = { get: false, put: false, remove: false, getById: false, post: true, state: false, mutation: false, getter: false };
const isCropAdminGenerator = { get: true, put: false, remove: false, getById: false, post: false, state: false, mutation: false, getter: false };
const isUsefullinfosGenerator = { get: true, put: false, remove: true, getById: false, post: false, state: false, mutation: false, getter: false };
const isCropsCategoryGenerator = { get: true, put: true, remove: true, getById: true, post: true, state: false, mutation: false, getter: false };
const store = createStore({
    namespaced: true,
    state() {
        // return {
        //     isLogined: false
        // };
    },
    mutations: {
        // SET_IS_LOGINED(state, payload) {
        //     state.isLogined = payload;
        // }
    },
    actions: {
        uploadFile({ commit }, payload) {
            console.log(payload);
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
        getUsers ({commit},payload) {
            return new Promise((resolve, reject) => {
                const pageSize = 25;
                request.get('/users', {params:{start: (payload.page-1||0)*pageSize, limit: pageSize,populate: '*', filters:payload.filters}})
                    .then(res => {
                        console.log(res);
                        const meta ={
                            page: payload.page||1,
                            pageCount: Math.ceil(res.total/pageSize),
                            pageSize,
                            total: res?.total||0
                        }
                        resolve({data:res?.users, meta})
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
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
        }
    },
    modules: {
        Abouts,
        login: CRUD('login', isLoginGenerator, '/auth/local'),
        products: CRUD('products', isCrudGenerator),
        cropAdmin: CRUD('cropAdmin', isCropAdminGenerator, '/admin/crops'),
        cropsCategory: CRUD('cropsCategory', isCrudGenerator, '/crop-categories'),
        activityTypes: CRUD('activityTypes', isCrudGenerator, '/activity-types'),
        farmers: CRUD('farmers', isCrudGenerator),
        companies: CRUD('companies', isCropAdminGenerator),
        treatments: CRUD('treatments', isCrudGenerator),
        fertilizations: CRUD('fertilizations', isCrudGenerator),
        diseases: CRUD('diseases', isCrudGenerator),
        diseaseCategory: CRUD('diseaseCategory', isCrudGenerator, '/disease-category'),
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
        usefullinfos: CRUD('usefullinfos', isUsefullinfosGenerator),
        type: CRUD('type', isUsefullinfosGenerator)
    }
});
store.hasAction = function (actionName) {
    return !!store._actions[actionName];
};
export default store;
