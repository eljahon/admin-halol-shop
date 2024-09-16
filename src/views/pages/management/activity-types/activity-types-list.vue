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
const meta = ref({});

const { getActivityTypes, deleteActivityTypes } = actions(['activityTypes'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'activity_types-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteActivityTypes(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('crops') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getCropsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}

function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:desc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 25 },
        filters: {
            is_common: _query?.is_common ?? undefined,
            name: {
                $containsi: _query.search ?? undefined
            }
        }
    };
    getActivityTypes(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}

getCropsList();

function onChangePage(value) {
    getCropsList();
}

watch(
    () => route.query,
    (value) => {
        console.log(value, 'valtcha');
    }
);
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-end">
                <div class="flex gap-2 justify-end">
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                    <template #loading>
                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                            <Skeleton width="60%" height="1rem" />
                        </div>
                    </template>
                </Column>
                <Column :header="$t('image')" style="max-width: 6rem">
                    <template #body="{ data }">
                        <ImageOnLoad width="90" :src="data?.icon?.aws_path" />
                    </template>
                </Column>
                <Column field="name" :header="$t('name')" style="min-width: 4rem"></Column>
                <Column field="category" :header="$t('date')" style="min-width: 5rem">
                    <template #body="{ data }">
                        <span v-if="data.createdAt">{{ dayjs(data.createdAt).format('DD-MM-YYYY hh:mm') }}</span>
                        <span v-else class="text-red-500">{{ '--' }}</span>
                    </template>
                </Column>

                <Column :header="$t('actions')" :frozen="true" style="">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'activity_types-create', params: { id: data.id } })" />
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
