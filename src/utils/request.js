import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import store from '@/store';
const urlSub=localStorage.getItem('role')||'shared'

let config = {
    baseURL: import.meta.env.VITE_APP_API_URL+'/'+urlSub,

};

const request = axios.create(config);
function showToast(severity, summary, detail) {
    const toast = useToast();
    return toast.add({ severity, summary, detail, life: 3000 });
}
function Error(status) {
    // console.log(status);
    store.dispatch('error', status)
    function notAuth() {
        localStorage.clear();
         window.location.href='/auth/login'
    }

    switch (status) {
        case 401:
            return notAuth();

        case 403: store.dispatch('error', status)
    }
}
request.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
        config.headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': config.url === '/upload/custom_upload' ? 'multipart/form-data' : 'application/json'
        };
    }
    return config;
});
request.interceptors.response.use(
    function (response) {
        if (response?.data) return response.data;
        //
        return response;
        // throw new Error('Promei error');
    },
    function (error) {
        const {
            message,
            response: { status }
        } = error;
        console.log(status);
        Error(status);
        // showToast('error', 'Error Message',message+"" + status,)

        useToast().add({ severity: 'error', summary: 'Error Message', detail: message + '' + status, life: 3000 });
        return Promise.reject({ message, status });
    }
);

export default request;
