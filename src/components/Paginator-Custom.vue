<script setup>
import { useRoute, useRouter } from 'vue-router';
import Paginator from 'primevue/paginator';
const props = defineProps(['meta', 'refetch']);
const emit = defineEmits(['onChangePage']);
const router = useRouter();
const route = useRoute()
async function onChangePage(value) {
    const {page,rows} = value;
    console.log(page, 'page');
    const _query ={...route.query}
    // if((route.query?.page||1) <=page) {
        await router.replace({query: {..._query, page:page+1, pageSize: rows}})
        emit('onChangePage', { page:page+1, pageSize: rows});
    // }
}
function OnFirst(value) {
    console.log('firs', '===>>', value);
}
function onRows(value) {
    console.log(value, 'row');
}
</script>

<template>
    <div>
        <Paginator @page="onChangePage" @update:first="OnFirst" @update:rows="onRows" :rows="meta?.pageSize" :first="(meta?.page - 1) * meta?.pageSize"  :totalRecords="meta?.total" :rowsPerPageOptions="[5,10,25, 50, 75, 100]"></Paginator>
    </div>
</template>

<style scoped lang="scss"></style>
