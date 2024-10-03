<script setup>
// import {router, store} from './modules/index';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore()

// console.log(store, router, 'module');
const {t} = useI18n()
const toast = useToast()
const token =localStorage.getItem('token');
if(token) store.dispatch('getConfigSettings')
watch(()=> store.state.errorStatus, (value) => {
    toast.add({ severity: 'error', summary: value, detail: value, life: 3000 });

})
document.title = t('logo-title')
</script>

<template>
    <Toast/>
    <router-view />
</template>

<style scoped></style>
