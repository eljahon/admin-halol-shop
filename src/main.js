import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import store from '@/store';
import i18n from '@/i18n';
import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(i18n)
app.use(ConfirmationService);

app.mount('#app');
