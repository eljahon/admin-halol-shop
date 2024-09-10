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
const regions = ref(undefined);
const region = ref(route.query.region ? +route.query.region : undefined);
const districts = ref(undefined);
const district = ref(route.query.district ? +route.query.district : undefined);
const areas = ref();
const area = ref(route.query.area ? +route.query.area : undefined);
const meta = ref({});

const { getEmployees, deleteEmployees } = actions(['employees'], { get: true, remove: true });
// console.log(action, 'list');
function openNew() {
    router.push({ name: 'employees-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteEmployees(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: t('employees'), detail: t('employees') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getCropsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error',  summary: t('employees'), detail: t('employees'), life: 3000 });
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
        pagination:{
            page: _query?.page ? +_query?.page : 1,
            pageSize: _query.pageSize ? +_query.pageSize : 25 ,
        }
    };
    return getEmployees(filters)
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

function onChangePage(value) {
    getCropsList();
}
getCropsList();
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
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                </Column>

                <Column field="fullname" :header="$t('fullname')"></Column>
                <Column field="about" :header="$t('about')"></Column>
                <Column field="phone" :header="$t('phone')"></Column>


                <Column  :frozen="actions" align-frozen="left">
                    <template #header>
                        <div>{{$t('employee_roles')}}</div>
                    </template>
                    <template #body="{ data }">
                       <span class="text-primary">{{data.employee_role?.name}}</span>
                    </template>
                </Column>  <Column  :frozen="actions" align-frozen="left">
                    <template #header>
                        <div>{{$t('farmer')}}</div>
                    </template>
                    <template #body="{ data }">
                       <span class="text-primary">{{data.farmer.username}}</span>
                    </template>
                </Column>
                <Column  :frozen="actions" align-frozen="left" style="min-width: 1rem" class="flex justify-end">
                    <template #header>
                        <div>{{$t('actions')}}</div>
                    </template>
                    <template #body="{ data }">
                        <!--                        <Button icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="router.push({ name: 'farmers-info', query: { id: data.id } })" />-->
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'employees-create', params: { id: data.id } })" />
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
