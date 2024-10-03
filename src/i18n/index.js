import { createI18n } from 'vue-i18n';
import ru from '@/i18n/locales/ru.json';
import en from '@/i18n/locales/en.json';
import uz from '@/i18n/locales/uz.json';
const i18n = createI18n({
    locale: localStorage.getItem('lang')||'en',
    fallbackLocale: 'en',
    legacy: false,
    globalInjection: true,
    allowComposition: true,
    warnHtmlInMessage: "off",
    messages: { ru, en, uz }
});

export default i18n;
