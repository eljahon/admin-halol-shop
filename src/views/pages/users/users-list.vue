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
import TheTabs from '@/components/TheTabs.vue';
const tabList = ref([
    { label: 'users', id: 0, key: null, icon: 'pi pi-users' },
    { label: 'consultants', id: 1, key: 'consultant', icon: 'pi pi-user-edit' }
]);
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

const { getFarmers, deleteFarmers, getRegions, getDistricts, getAreas } = actions(['farmers', 'regions', 'districts', 'areas'], { get: true, remove: true });
// console.log(action, 'list');
function openNew() {
    router.push({ name: 'user-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteFarmers(crop.value.id)
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

async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    await getCropsList();
}

// let onSearch = debounce(function(value) {
//     routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
// }, 1500)
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };

    return store
        .dispatch('getUsers', { page: +route.query.page ?? 1, pageSize: _query.pageSize ?? 25, filters: { role: { type: { $eq: _query?.user ?? undefined } } } })
        .then((res) => {
            console.log(res);
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

getCropsList();
function onChangePage() {
    getCropsList();
}
function onChangeTabs(value) {
    console.log(value.key);
    if (value.key) routerPush({ user: value.key, page: 1 });
    else routerPush({ user: undefined });
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-end">
                <div class="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <TheTabs :tabs-list="tabList" @on-change-tab="onChangeTabs">
                <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                    <template #header> </template>
                    <Column :header="'N%'">
                        <template #body="{ index }">
                            <span>{{ (+route.query?.page || 1) * 25 - 25 + index + 1 }}</span>
                        </template>
                    </Column>
                    <Column field="id" :header="$t('id')"> </Column>
                    <Column :header="$t('fullname')" style="min-width: 10rem">
                        <template #body="{ data }">
                            <span class="text-primary">{{ data?.fullname }}</span>
                        </template>
                    </Column>
                    <Column field="phone" :header="$t('phone')" style="min-width: 8rem"></Column>
                    <Column field="email" :header="$t('email')" style="min-width: 8rem"></Column>
                    <Column field="role" :header="$t('role')" style="min-width: 0rem">
                        <template #body="{ data }">
                            <span class="text-primary">{{ data.role.name }}</span>
                        </template>
                    </Column>

                    <Column field="date" :header="$t('date')" style="min-width: 11rem">
                        <template #body="{ data }">
                            <span>{{ dayjs(data.createAt).format('hh:mm YYYY-MM-DD') }}</span>
                        </template>
                    </Column>
                    <Column :header="$t('actions')" :frozen="actions" align-frozen="left" style="min-width: 12rem" class="flex justify-end">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'user-create', params: { id: data.id } })" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                        </template>
                    </Column>
                    <template #footer>
                        <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                    </template>
                </DataTable>
            </TheTabs>
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
