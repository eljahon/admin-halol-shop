import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

let config = {
    baseURL: import.meta.env.VITE_APP_API_URL,

};

const request = axios.create(config);
function showToast(severity, summary, detail) {
    const toast = useToast();
    return toast.add({ severity, summary, detail, life: 3000 });
}
function Error(status) {
    function notAuth() {
        localStorage.clear();
        const router = useRouter();
        return router.push('/auth/login');
    }

    switch (status) {
        case 401:
            return notAuth();
    }
}
request.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
        config.headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
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
