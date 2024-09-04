<script setup>
// import {router, store} from './modules/index';
import { useI18n } from 'vue-i18n';

// console.log(store, router, 'module');
const {t} = useI18n()
document.title = t('logo-title')
</script>

<template>
    <router-view />
</template>

<style scoped></style>
