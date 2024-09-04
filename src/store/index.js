import { createStore } from 'vuex';
import { Abouts } from '@/store/modules';
import CRUD from '@/utils/dynamickCrud';
import request from '@/utils/request';
const isCrudGenerator = { get: true, put: true, remove: true, getById: true, post: true, state: false, mutation: false, getter: false };
const isLoginGenerator = { get: false, put: false, remove: false, getById: false, post: true, state: false, mutation: false, getter: false };
// const isCropsGenerator={ get:true, put:true,remove:true,getById:true,post:true, state:false, mutation:false, getter:false}
// const isProductsGenerator={ get:true, put:true,remove:true,getById:true,post:true, state:false, mutation:false, getter:false}
const isCropAdminGenerator = { get: true, put: false, remove: false, getById: false, post: false, state: false, mutation: false, getter: false };
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
        // login({ commit }, payload) {
        //     commit('SET_IS_LOGINED', payload);
        // }

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
        crops: CRUD('crops', isCrudGenerator),
        products: CRUD('products', isCrudGenerator),
        cropAdmin: CRUD('cropAdmin', isCropAdminGenerator, '/admin/crops'),
        cropsCategory: CRUD('cropsCategory', isCrudGenerator, '/crop-categories'),
        activityTypes: CRUD('activityTypes', isCrudGenerator, '/activity-types'),
        companies:CRUD('companies',isCropAdminGenerator)
    }
});
store.hasAction = function (actionName) {
    return !!store._actions[actionName];
};
export default store;
