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
const crops = ref();
const crop = ref();
const deleteCropDialog = ref(false);
const isLoading = ref(false);
const search = ref(route.query.search ?? undefined);
const meta = ref({});

const { getFertilizers, deleteFertilizers } = actions(['fertilizers'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'fertilizers-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteFertilizers(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('crops') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getFertilizersList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}

function getFertilizersList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'id:desc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 10 },
        filters:{
            name:{$containsi: _query?.search ?? undefined}
        }
    };
    getFertilizers(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}

getFertilizersList();

function onChangePage(value) {
    getFertilizersList();
}

async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    getFertilizersList();
}
let onSearch = debounce(function (value) {
    routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500);
</script>

<template>
    <div>
<!--        <TheBreadcrumb />-->
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
                <Column :header="$t('image')" style="max-width: 6rem">
                    <template #body="{ data }">
                        <ImageOnLoad :styles="{width: 50+'px', height: 50+'px'}" width="90" :src="data?.image?.aws_path" />
                    </template>
                </Column>
                <Column field="name" :header="$t('name')" style="min-width: 12rem"></Column>
                <!-- <Column field="district.name" :header="$t('district')" style="min-width: 12rem"></Column> -->

                <Column field="fertilizer_category.name" :header="$t('fertilizer-category')" style="min-width: 12rem"></Column>

<!--                <Column :header="$t('actions')" :frozen="actions" style="min-width: 8rem">-->
<!--                    <template #body="{ data }">-->
<!--                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'fertilizers-create', params: { id: data.id } })" />-->
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
