<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useStore } from 'vuex';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
const store = useStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const dt = ref();
const crops = ref();
const filters = ref({
    start_date: route?.query?.start_date ?? undefined,
    end_date: route?.query?.end_date ?? undefined
});
const isLoading = ref(false);
const datePicker =ref(null)


const meta = ref({});

const { getChatStatistics } = actions(['chatStatistics'], { get: true });

async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    await getCropsList();
}
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:desc',
        page: _query?.page ? +_query?.page : 1,
        pageSize: _query.pageSize ? +_query.pageSize : 25,
        start_date: _query.start_date ?? undefined,
        end_date: _query.end_date ?? undefined
    };
    return getChatStatistics(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
            return res;
        })
        .catch((err) => {
            isLoading.value = false;
        });
    // .finally(() =>{
    //     isLoading.value =false
    // });
}

function onChangePage(value) {
    getCropsList();
}
getCropsList();


function onDatePickerStart(value) {
    if(value) routerPush({start_date: dayjs(value).format('YYYY-MM-DD')})
    else routerPush({start_date: undefined})
 }
 function onDatePickerEnd(value) {
     if(value) routerPush({end_date: dayjs(value).format('YYYY-MM-DD')})
     else routerPush({end_date: undefined})

 }
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2">
                <DatePicker showButtonBar  @update:modelValue="onDatePickerStart" :invalid="!filters.start_date" v-model="filters.start_date" :placeholder="$t('start_date')" showIcon fluid iconDisplay="input" dateFormat="yy-mm-dd"></DatePicker>
                <DatePicker showButtonBar  @update:modelValue="onDatePickerEnd" :invalid="!filters.end_date" v-model="filters.end_date" :placeholder="$t('end_date')" showIcon iconDisplay="input" dateFormat="yy-mm-dd"></DatePicker>
            </div>
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <Column field="fullname" :header="$t('fullname')"></Column>
                <Column field="username" :header="$t('username')"></Column>
                <Column field="all_chats" :header="$t('all_chats')"></Column>
                <Column field="finished" :header="$t('finished')"></Column>
                <Column field="unfinished" :header="$t('unfinished')"></Column>
                <template #footer>
                    <!--                    <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />-->
                </template>
            </DataTable>
        </div>
    </div>
</template>
