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

const { getNews, deleteNews } = actions(['news', 'relations'], { get: true, remove: true });

function openNew() {
    router.push({ name: 'news-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteNews(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: t('news'), detail: t('news') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getCropsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'news Deleted', life: 3000 });
            isLoading.value = false;
        });
}

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
        pagination:{page: _query?.page ? +_query?.page : 1,
            pageSize: _query.pageSize ? +_query.pageSize : 25},
        filters:{relation:{name:{
            $eq: 'crop'
                }}}
    };
    return getNews(filters)
        .then((res) => {
            crops.value = res.data;
            meta.value = res.meta;
            isLoading.value = false;
            return res;
        })
        .catch((err) => {
            isLoading.value = false;
        });
}
getCropsList();

function onChangePage(value) {
    getCropsList();
}
</script>

<template>
    <div>
        <div class="card">

            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                </Column>
                <Column :header="$t('title')" style="min-width: 16rem">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.title }}</span>
                    </template>
                </Column>
                <Column :header="$t('model')" style="min-width: 16rem">
                    <template #body="{ data }">
                        <span>{{data.model}}</span>
                    </template>
                </Column>
                <Column :header="$t('relation')" style="min-width: 16rem">
                    <template #body="{ data }">
                        <span>{{data?.relation?.name?? '-'}}</span>
                    </template>
                </Column>
<!--                <Column :header="$t('actions')" :frozen="actions" align-frozen="left" style="min-width: 12rem">-->
<!--                    <template #body="{ data }">-->
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
