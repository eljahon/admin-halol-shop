<script setup>
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { actions } from '@/utils/Store_Schema';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const dt = ref();
const treatments = ref();
const treatment = ref();
const search = ref(route.query?.search?? undefined);
const deleteTreatmentsDialog = ref(false);
const isLoading = ref(false);

const meta = ref({});

const { getTreatments, deleteTreatments } = actions(['treatments'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'treatments-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    treatment.value = prod;
    deleteTreatmentsDialog.value = true;
}

function deleteProduct() {
    deleteTreatmentsDialog.value = false;
    isLoading.value = true;
    deleteTreatments(treatment.value.id)
        .then((res) => {
            treatment.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('treatments') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getTreatmentsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}

function getTreatmentsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:asc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 25 },
        filters: {
            is_common: _query?.is_common ?? undefined,
            disease:{
                name: {
                    $containsi: _query.search ?? undefined
                }
            }
        }
    };
    getTreatments(filters)
        .then((res) => {
            treatments.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}

getTreatmentsList();

function onChangePage(value) {
    getTreatmentsList();
}
async function routerPush(param) {
    const _query ={...route.query, ...param}

    await router.replace({ query: _query });
    getTreatmentsList()
}
let onSearch = debounce(function(value) {
    routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500)
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-between">
                <div>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="search" :placeholder="$t('disease')+' ' + $t('search')" @input="onSearch" />
                    </IconField>
                </div>
                <div class="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <DataTable ref="dt" :value="treatments" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')" style="max-width: 4rem">
                    <template #loading>
                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                            <Skeleton width="60%" height="1rem" />
                        </div>
                    </template>
                </Column>
                <Column field="disease.name" :header="$t('disease')" style="min-width: 10rem"></Column>
                <Column field="drug.name" :header="$t('drug')" style="min-width: 10rem"></Column>

                <Column field="dose" :header="$t('dose')" style="min-width: 6rem"></Column>
                <Column field="dose_min" :header="$t('dose_min')" style="min-width: 6rem"></Column>
                <Column field="dose_max" :header="$t('dose_max')" style="min-width: 6rem"></Column>
                <Column :header="$t('actions')" :frozen="actions" style="min-width: 10rem;">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'treatments-create', params: { id: data.id } })" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
        <Dialog v-model:visible="deleteTreatmentsDialog" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('remove') }}</h1>
            </template>
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="treatment"
                    >{{ $t('you-want-to-delete') }} <b>{{ treatments.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteTreatmentsDialog = false" />
                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>
    </div>
</template>
