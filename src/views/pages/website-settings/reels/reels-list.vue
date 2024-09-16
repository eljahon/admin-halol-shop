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


const { getReels, deleteReels} = actions(['reels'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'reels-create', params: { id: 'new' } });
}


function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteReels(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('crops')+' '+t('delete'), life: 3000 });
            isLoading.value = false;
            getCropsList()
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}


async function routerPush(param) {
    console.log(route.query, '==>>', param);
    const _query ={...route.query, ...param}
    console.log(_query);
    await router.replace({ query: _query });
    await getCropsList();
}

let onSearch = debounce(function(value) {
    routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500)
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: {id: 'desc'},
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 10 },
        filters: {
            is_common: _query?.is_common ?? undefined,
            title: {
                $containsi: _query.search ?? undefined
            }
        }
    };
    getReels(filters)
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
            <div class="flex gap-2 justify-between">
                <div>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="search" :placeholder="$t('search-by-name')" @input="onSearch" />
                        </IconField>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <Column field="id" :header="$t('id')">
                    <template #loading>
                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                            <Skeleton width="60%" height="1rem" />
                        </div>
                    </template>
                </Column>
                <Column :header="$t('image')" style="min-width: 8rem">
                    <template #body="{ data }">
                        <div class="flex justify-center items-center">
                            <ImageOnLoad v-if="!data.media?.aws_path.includes('mp4')" width="90" :src="data?.media?.aws_path" />
                            <i v-else class="pi pi-video text-2xl text-primary"></i>
                        </div>
                    </template>
                </Column>
                <Column field="title" :header="$t('title')" style="min-width: 16rem"></Column>
                <Column field="category" :header="$t('date')" style="min-width: 12rem; text-align: center">
                    <template #body="{ data }">
                        <span>{{ dayjs().format('DD-MM-YYYY') }}</span>
                    </template>
                </Column>
                <Column :header="$t('actions')" :frozen="actions" align-frozen="left" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'reels-create', params: { id: data.id } })" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
        <Dialog v-model:visible="deleteCropDialog" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('remove') }}</h1>
            </template>
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="crop"
                >{{ $t('you-want-to-delete') }} <b>{{ crop.name }}</b
                >?</span
                >
            </div>
            <template #footer>
                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteCropDialog = false" />
                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>
    </div>
</template>
