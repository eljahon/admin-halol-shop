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
const companiyList =ref(undefined)
const url = import.meta.env.VITE_APP_AWS_PATH;
const deleteCropDialog = ref(false);
const isLoading = ref(false);
const confirmedList = ref([
    { name: t('all'), id: 'all' },
    { name: t('confirmed'), id: 'true' },
    { name: t('not_confirmed'), id: 'false' }
]);

const cropsFilter = ref(route.query?.confirmed ?? 'all');
const companyFilter = ref(route.query?.comp ? +route.query.comp :undefined);
const search = ref(route.query?.search ?? '');
const meta = ref({});

const { getProducts, deleteProducts, getCompanies } = actions(['products', 'companies'], { get: true, remove: true });
function openNew() {
    router.push({ name: 'crops-create', params: { id: 'new' } });
}

function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}

function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteProducts(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: t('products'), detail: t('products') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getCropsList();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: t('products'), detail: t('products'), life: 3000 });
            isLoading.value = false;
        });
}

const excelDownload = async () => {
    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    worksheet.addRow(['Id', 'Name', 'Biology name', 'Description', 'Details', 'Diseases', 'Season', 'Drugs', 'Fertilizers']);
    for (let i = 0; i < crops.value.length; i++) {
        worksheet.columns = [{ width: 5 }, { width: 16 }, { width: 16 }, { width: 48 }, { width: 48 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }];
        const { id, name, biology_name, description, details, diseases, season, drugs, fertilizers } = crops.value[i];
        worksheet.addRow([id, name, biology_name, description, details, diseases?.name, season?.title, drugs?.name, fertilizers?.name]);
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'crops.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
async function routerPush(param) {
    console.log(route.query, '==>>', param);
    const _query = { ...route.query, ...param };
    console.log(_query);
    await router.replace({ query: _query });
    await getCropsList();
}

function onChangeSelect(value) {
    if(value !== 'all')   routerPush({ confirmed: value, page: 1 });
    else  routerPush({ confirmed: undefined, page: 1 });

}
function onChangeSelectCom(value) {
    routerPush({ comp: value ? value : undefined, page: 1 });
}

let onSearch = debounce(function (value) {
    routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500);
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: 'company,company.owner,image,unit,drug_category,cer',
        sort: 'createdAt:desc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 25 },
        filters: {
            confirmed: _query?.confirmed ?? undefined,
            company: _query.comp ?? undefined,
            title: {
                $containsi: _query.search ?? undefined
            }
        }
    };
    getProducts(filters)
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
function productConfirmed(item) {
    isLoading.value = true
    if (!item.confirmed) {
        store
            .dispatch('productConfirmed', {id: item.id })
            .then((res) => {
                isLoading.value = false;
                toast.add({ severity: 'success', summary: t('products'), detail: t('product-confirmed'), life: 3000 });
                getCropsList()
            })
            .catch((err) => {
                isLoading.value=false;
                console.log(err);
                toast.add({ severity: 'error', summary: t('products'), detail: t('product-confirmed-error'), life: 3000 });

            });
    } else {
        toast.add({ severity: 'info', summary: t('products'), detail: t('product-confirmed'), life: 3000 });
    }
}

getCropsList();
getCompanies({pagination:{page: 1,pageSize: 100}})
    .then(res => {
        companiyList.value = res.data
    })

function onChangePage(value) {
    getCropsList();
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-between">
                <div>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <Select
                            class="w-full md:w-56"
                            v-model="cropsFilter"
                            :placeholder="$t('all')"
                            optionLabel="name"
                            optionValue="id"
                            showClear
                            @update:modelValue="onChangeSelect"
                            :options="confirmedList"
                        >
                        </Select>     <Select
                            class="w-full md:w-56"
                            v-model="companyFilter"
                            :placeholder="$t('company')"
                            optionLabel="name"
                            optionValue="id"
                            showClear
                            @update:modelValue="onChangeSelectCom"
                            :options="companiyList"
                        >
                        </Select>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="search" :placeholder="$t('search-by-name')" @input="onSearch" />
                        </IconField>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button label="Export" icon="pi pi-upload" severity="success" @click="excelDownload" />
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
                <Column :header="$t('image')" style="min-width: 7rem">
                    <template #body="{ data }">
                        <ImageOnLoad width="100" height="100" :src="data?.image?.aws_path" />
                    </template>
                </Column>
                <Column field="title" :header="$t('name')"></Column>

                <Column :header="$t('company')" style="min-width: 9rem">
                    <template #body="{ data }">
                        {{ data?.company?.name ?? '-' }}
                    </template>
                </Column>
                <Column field="category" :header="$t('certificate')">
                    <template #body="{ data }">
                        <div class="flex gap-2 items-center" v-if="data.cer">
                            <i class="pi pi-cloud-download text-blue-400"></i>
                            <a class="text-blue-400" target="_blank" :href="url + data?.cer?.aws_path">{{ $t('certificate') }}</a>
                        </div>
                        <span v-else class="text-primary">{{ $t('not_certificate') }}</span>
                    </template>
                </Column>
                <Column field="rating" :header="$t('confir')">
                    <template #body="{ data }">
                        <div v-if="data?.confirmed">
                            <Tag><i class="pi pi-check-circle"></i>{{ $t('confirmed') }}</Tag>
                        </div>
                        <div v-else @click="productConfirmed(data)" class="cursor-pointer">
                            <Tag severity="warn"><i class="pi pi-times-circle"></i>{{ $t('not_confirmed') }}</Tag>
                        </div>

                        <!--                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />-->
                    </template>
                </Column>
                <Column :header="$t('actions')" :frozen="actions" align-frozen="left">
                    <template #body="{ data }">
                        <div class="flex">
                            <Button icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="router.push({ name: 'products-info', query: { id: data.id } })" />
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'products-create', params: { id: data.id } })" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                        </div>
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
