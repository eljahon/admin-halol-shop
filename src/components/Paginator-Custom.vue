<script setup>
import { useRoute, useRouter } from 'vue-router';

const props = defineProps(['meta', 'refetch']);
const emit = defineEmits(['onChangePage']);
const router = useRouter();
const route = useRoute()
async function onChangePage(value) {
    const {page,rows} = value;
    const _query ={...route.query}
    if(Object.keys(_query).length <=2) {
        await router.replace({query: {..._query, page:page+1, pageSize: rows}})
        emit('onChangePage', { page:page+1, pageSize: rows});
    }
}
</script>

<template>
    <div>
        <Paginator @page="onChangePage" :rows="meta?.pageSize" :first="(meta?.page - 1) * meta?.pageSize"  :totalRecords="meta.total" :rowsPerPageOptions="[25, 50, 75, 100]"></Paginator>
    </div>
</template>

<style scoped lang="scss"></style>
