import { camelize } from '@/utils/index';
import store from '@/store';

export const actions = (param, isMethods) => {
    if (Array.isArray(param) && isMethods) {
        const { get = false, post = false, put = false, remove = false, getById = false } = isMethods;
        let res = {};
        for (const element of param) {
            if (get) res[camelize(`get ${element}`)] = (payload) => store.dispatch(`${camelize(`get ${element}`)}`, payload);

            if (post) res[camelize(`post ${element}`)] = (payload) => store.dispatch(`${camelize(`post ${element}`)}`, payload);

            if (remove) res[camelize(`delete ${element}`)] = (payload) => store.dispatch(`${camelize(`delete ${element}`)}`, payload);

            if (put) res[camelize(`put ${element}`)] = (payload) => store.dispatch(`${camelize(`put ${element}`)}`, payload);

            if (getById) res[camelize(`get by id ${element}`)] = (payload) => store.dispatch(`${camelize(`get by id ${element}`)}`, payload);
        }
        return res;
    } else if (Array.isArray(param) && !isMethods) return {};
    return {
        [camelize(`get ${param}`)]: (payload) => store.dispatch(`${camelize(`get ${param}`)}`, payload),
        [camelize(`get by id ${param}`)]: (payload) => store.dispatch(`${camelize(`get by id ${param}`)}`, payload),
        [camelize(`post ${param}`)]: (payload) => store.dispatch(`${camelize(`post ${param}`)}`, payload),
        [camelize(`put ${param}`)]: (payload) => store.dispatch(`${camelize(`put ${param}`)}`, payload),
        [camelize(`delete ${param}`)]: (payload) => store.dispatch(`${camelize(`delete ${param}`)}`, payload)
        // lang: camelize(`lang ${param}`),
    };
};

export const getters = (param) => {
    return {
        load: camelize(`load ${param}`),
        loadOne: camelize(`one load ${param}`),
        data: camelize(`data ${param}`),
        error: camelize(`error ${param}`),
        pending: camelize(`pending ${param}`),
        deleting: camelize(`deleting ${param}`),
        pagination: camelize(`pagination ${param}`)
    };
};
