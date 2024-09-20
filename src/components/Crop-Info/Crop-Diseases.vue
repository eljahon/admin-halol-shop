<script setup>
import ImageOnLoad from '@/components/ImageOnLoad.vue';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { actions } from '@/utils/Store_Schema';
import dayjs from 'dayjs';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import SelectsIndex from '@/components/Selects/Selects-index.vue';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const dt = ref();
const crops = ref();
const crop = ref();
const diseasesCat = ref();
const areas = ref(route.query?.dis ? route.query.dis : undefined);
const search = ref(route.query?.search ?? undefined);
const deleteCropDialog = ref(false);
const diseasesCrop = ref();
const isLoading = ref(false);

const meta = ref({});

const { getDiseases, deleteDiseases, getDiseasesType, getCrops } = actions(['diseases', 'diseasesType','crops'], { get: true, remove: true });
// function openNew() {
//     router.push({ name: 'diseases-create', params: { id: 'new' } });
// }
// function getDiseasesCat() {
//     getDiseasesType().then((res) => {
//         diseasesCat.value = res.data;
//     });
// }
async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    getDiseasesList();
}
function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

// function deleteProduct() {
//     deleteCropDialog.value = false;
//     isLoading.value = true;
//     deleteDiseases(crop.value.id)
//         .then((res) => {
//             crop.value = {};
//             toast.add({ severity: 'success', summary: 'Successful', detail: t('diesases') + ' ' + t('delete'), life: 3000 });
//             isLoading.value = false;
//             getDiseasesList();
//         })
//         .catch((err) => {
//             toast.add({ severity: 'error', summary: 'Successful', detail: `${t('diesases')} Deleted`, life: 3000 });
//             isLoading.value = false;
//         });
// }
// function getCropsList() {
//     getCrops({pagination: {page: 1, pageSize: 10000}})
//         .then(res => {
//             diseasesCrop.value =res.data
//         })
// }
function getDiseasesList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:asc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 10 },
        filters: {
            crop:{
                id: _query.id ?? undefined
            }

        }
    };
    getDiseases(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}

getDiseasesList();
function onChangePage(value) {
    getDiseasesList();
}


// let onSearch = debounce(function (value) {
//     routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
// }, 1500);
// function filterAreas(value) {
//     routerPush({ dis: value ? value : undefined, page: 1 });
// }
// function filterCrops (value) {
//     routerPush({ value: value ? value : undefined, page: 1 });
// }
</script>

<template>
    <div>
        <div class="card">
            <div class="flex gap-2 justify-between">
            </div>
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <Column field="id" :header="$t('id')">
                    <template #loading>
                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                            <Skeleton width="60%" height="1rem" />
                        </div>
                    </template>
                </Column>
                <Column :header="$t('image')" style="max-width: 6rem">
                    <template #body="{ data }">
                        <ImageOnLoad :styles="{ width: 90 + 'px', height: 90 + 'px' }" width="90" :src="data?.image?.aws_path" />
                    </template>
                </Column>
                <Column field="name" :header="$t('name')" style="min-width: 12rem"></Column>
                <Column field="crop.name" :header="$t('crop')" style="min-width: 12rem"></Column>
                <Column field="category" :header="$t('date')" style="min-width: 5rem">
                    <template #body="{ data }">
                        <span v-if="data.createdAt">{{ dayjs(data.createdAt).format('DD-MM-YYYY hh:mm') }}</span>
                        <span v-else class="text-red-500">{{ '--' }}</span>
                    </template>
                </Column>

                <Column field="type" :header="$t('type')" style="min-width: 9rem">
                    <template #body="{ data }">
                        <Tag>{{ $t(`${data?.type}`) }}</Tag>
                    </template>
                </Column>
<!--                <Column :header="$t('actions')" :frozen="actions" style="min-width: 8rem">-->
<!--                    <template #body="{ data }">-->
<!--                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'diseases-create', params: { id: data.id } })" />-->
<!--                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />-->
<!--                    </template>-->
<!--                </Column>-->
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
