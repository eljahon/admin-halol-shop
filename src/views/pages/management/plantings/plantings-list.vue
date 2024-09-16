<script setup>
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { actions } from '@/utils/Store_Schema';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import SelectsIndex from '@/components/Selects/Selects-index.vue';
import dayjs from 'dayjs';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const dt = ref();
const plantings = ref();
const fertilization = ref();
const search = ref(route.query?.search ?? undefined)
const date = ref(route.query?.date ?? undefined)
const deletePlantingsDialog = ref(false);
const isLoading = ref(false);

const meta = ref({});

const { getPlantings, deletePlantings } = actions(['plantings'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'plantings-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    fertilization.value = prod;
    deletePlantingsDialog.value = true;
}

function deleteProduct() {
    deletePlantingsDialog.value = false;
    isLoading.value = true;
    deletePlantings(fertilization.value.id)
        .then((res) => {
            fertilization.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('plantings') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getPlantingsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}

function getPlantingsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:asc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 10 },
        filters: {
            crop: _query.crop ?? undefined,
            createdAt: _query.date ?? undefined,
            title: {
                $containsi: _query.search ?? undefined
            }
        }
    };
    getPlantings(filters)
        .then((res) => {
            plantings.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}

getPlantingsList();

function onChangePage(value) {
    getPlantingsList();
}
async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    getPlantingsList();
}
let onSearch = debounce(function (value) {
    routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500);
function filterCrop(value) {
    routerPush({crop: value ? value : undefined})
}
function filterDate(value) {
    console.log(value);
    const _date =dayjs(value).format('YYYY-MM-DD');
    routerPush({date: value ? _date : undefined})
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-between">
                <div class="flex gap-2">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="search" :placeholder="$t('name')" @input="onSearch" />
                    </IconField>
                    <SelectsIndex class="w-full" action-name="crops" filter-name="name" @update:modelValue="filterCrop" :placeholder="$t('crops')" />
                    <DatePicker v-model="date" showIcon fluid iconDisplay="input" dateFormat="yy-mm-dd" @update:modelValue="filterDate" class="w-full" :placeholder="$t('date')" />
                </div>
                <div class="flex gap-2 justify-end">
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <DataTable ref="dt" :value="plantings" dataKey="id" :loading="isLoading">
                <template #header> </template>

                <Column field="title" :header="$t('title')" style="min-width: 10rem">
                    <template #body="{data}">
                        {{data?.title ?? '-'}}
                    </template>
                </Column>
                <Column field="crop.name" :header="$t('crop')" style="min-width: 10rem"></Column>
                <Column field="variety" :header="$t('variety')" style="min-width: 10rem"></Column>
                <Column field="field" :header="$t('field')" style="min-width: 6rem">
                    <template #body="{data}">
                        {{data?.field?.name ?? '-'}}
                    </template>
                </Column>
                <Column field="season" :header="$t('season')" style="min-width: 10rem">
                    <template #body="{data}">
                        {{data?.season?.name ?? '-'}}
                    </template>
                </Column>
                <Column field="harvest_amount" :header="$t('harvest_amount')" style="min-width: 10rem">
                    <template #body="{data}">
                        {{data?.harvest_amount ?? '-'}}
                    </template>
                </Column>
                <Column field="harvest_time" :header="$t('harvest_time')" style="min-width: 10rem">
                    <template #body="{data}">
                        {{data?.harvest_time ?? '-'}}
                    </template>
                </Column>
                <Column :header="$t('actions')" :frozen="actions" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'plantings-create', params: { id: data.id } })" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
        <Dialog v-model:visible="deletePlantingsDialog" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('remove') }}</h1>
            </template>
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="fertilization"
                    >{{ $t('you-want-to-delete') }} <b>{{ plantings.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deletePlantingsDialog = false" />
                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>
    </div>
</template>
