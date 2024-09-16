<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useStore } from 'vuex';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import ImageOnLoad from '@/components/ImageOnLoad.vue';
import Exceljs from 'exceljs';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash';
const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const dt = ref();
const crops = ref();
const crop = ref();
const deleteCropDialog = ref(false);
const isLoading = ref(false);
let list = {
    undefined: { name: t('all'), id: undefined },
    true: { name: t('is_main'), id: true },
    false: { name: t('is_main_not'), id: false }
};
const cropsFilter = ref(list[route.query?.is_common].id);
const search = ref(route.query?.search ?? '');
const meta = ref({});


const { getCompanies, deleteActivityTypes} = actions(['companies'], { get: true });






// const excelDownload = async () => {
//     const workbook = new Exceljs.Workbook();
//     const worksheet = workbook.addWorksheet('Data');
//     worksheet.addRow(['Id', 'Name', 'Biology name', 'Description', 'Details', 'Diseases', 'Season', 'Drugs', 'Fertilizers']);
//     for (let i = 0; i < crops.value.length; i++) {
//         worksheet.columns = [{ width: 5 }, { width: 16 }, { width: 16 }, { width: 48 }, { width: 48 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }];
//         const { id, name, biology_name, description, details, diseases, season, drugs, fertilizers } = crops.value[i];
//         worksheet.addRow([id, name, biology_name, description, details, diseases?.name, season?.title, drugs?.name, fertilizers?.name]);
//     }
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'crops.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };
// function getStatusLabel(status) {
//     if (status) return 'success';
//
//     return 'danger';
// }
// async function routerPush(param) {
//     console.log(route.query, '==>>', param);
//     const _query ={...route.query, ...param}
//     console.log(_query);
//     await router.replace({ query: _query });
//     await getCropsList();
// }

// function onChangeSelect(value) {
//     routerPush({ is_common: value, page: 1 });
// }

// let onSearch = debounce(function(value) {
//     routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
// }, 1500)
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        // sort: 'createdAt:asce',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 25 },
        filters: {
            is_common: _query?.is_common ?? undefined,
            name: {
                $containsi: _query.search ?? undefined
            }
        }
    };
    getCompanies(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
    // .finally(() =>{
    //     isLoading.value =false
    // });
}

getCropsList();

function onChangePage(value) {
    getCropsList();
}

// onSearch = debounce(onSearch, 1500);
watch(() => route.query, (value) => {
    console.log(value, 'valtcha');
})
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                    <template #loading>
                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                            <Skeleton width="60%" height="1rem" />
                        </div>
                    </template>
                </Column>
                <Column :header="$t('image')" style="max-width: 8rem">
                    <template #body="{ data }">
                        <ImageOnLoad width="90" :src="data?.logo?.aws_path" />
                    </template>
                </Column>
                <Column field="name" :header="$t('name')" style="min-width: 12rem"></Column>
                <Column field="category" :header="$t('date')" style="min-width: 5rem">
                    <template #body="{ data }">
                        <span v-if="data.createdAt">{{ dayjs(data.createdAt).format('DD-MM-YYYY hh:mm') }}</span>
                        <span v-else class="text-red-500">{{ '--' }}</span>
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
    </div>
</template>
