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

const { getProducts,putProducts, deleteProducts, getCompanies } = actions(['products', 'companies'], { get: true, remove: true, put: true });
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

// const excelDownload = async () => {
//     const workbook = new Exceljs.Workbook();
//     const worksheet = workbook.addWorksheet('Data');
//     worksheet.addRow(['Id', 'Name', 'Biology name', 'Description', 'Details', 'Diseases', 'Season', 'Drugs', 'Fertilizers']);
//     for (let i = 0; i < crops.value.length; i++) {
//         worksheet.columns = [{ width: 5 }, { width: 16 }, { width: 16 }, { width: 48 }, { width: 48 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }];
//         const { id, name, biology_name, description, details, diseases, season, drugs, fertilizers } = crops.value[i];
//         worksheet.addRow([id, name, biology_name, description, details, diseases?.name, season?.title, drugs?.name, fertilizers?.name]);
//     }
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'crops.xlsx');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };
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
        // populate: 'company,company.owner,image,unit,drug_category,cer',
        // sort: 'createdAt:desc',
        // pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 10 },
        // filters: {
        //     confirmed: _query?.confirmed ?? undefined,
        //     company: _query.comp ?? undefined,
        //     title: {
        //         $containsi: _query.search ?? undefined
        //     }
        // }
    };
    getCompanies(filters)
        .then((res) => {
            crops.value = res.data.companies            ;
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
function productConfirmed(item, data, text) {
    isLoading.value = true;
    putProducts({id: item._id, data})
        .then(res => {
            isLoading.value = false;
            toast.add({ severity: 'success', summary: t('product'), detail: t(text), life: 3000 });
            getCropsList()
        })
        .catch(err => {
            
        })
    // if (!item.confirmed) {
    //     store
    //         .dispatch('productConfirmed', {id: item.id })
    //         .then((res) => {
    //             isLoading.value = false;
    //             toast.add({ severity: 'success', summary: t('products'), detail: t('product-confirmed'), life: 3000 });
    //             getCropsList()
    //         })
    //         .catch((err) => {
    //             isLoading.value=false;
    //             console.log(err);
    //             toast.add({ severity: 'error', summary: t('products'), detail: t('product-confirmed-error'), life: 3000 });

    //         });
    // } else {
    //     toast.add({ severity: 'info', summary: t('products'), detail: t('product-confirmed'), life: 3000 });
    // }
}

getCropsList();


function onChangePage(value) {
    getCropsList();
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <!-- <div class="flex gap-2 justify-between">
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
            </div> -->
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                    <template #body="{ data, index }">
                      <span class="text-primary">{{index+1}}</span>
                    </template>
                </Column>
                <Column :header="$t('image')" style="min-width: 4rem; height: 2rem">
                    <template #body="{ data }">
                        <!-- <img width="50" height="40" :src="url+data?.main_image" alt=""> -->
                       <ImageOnLoad rounded :imageHeight="90" :imageWidth="90" width="100" image-height="30" image-width="30" height="100" :src="data?.main_image" />
                    </template>
                </Column>
                <Column field="name" :header="$t('name')">
                    <template #body="{ data }">
                        <span class="text-primary">{{data?.name?? '-'}}</span>
                    </template>
                </Column>

                <Column field="price" :header="$t('price')">
                    <template #body="{ data }">
                        <span class="text-primary">{{Intl.NumberFormat().format(data?.price)}}</span>
                    </template>
                </Column>
                <Column field="discount" :header="$t('discount')">
                    <template #body="{ data }">
                        <span class="text-primary">{{data?.discount}} %</span>
                    </template>
                </Column>
                <Column field="buyed_count" :header="$t('buyed_count')" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span class="text-primary">{{data?.buyed_count?? '-'}}</span>
                    </template>
                </Column>

                <Column :header="$t('category')" style="min-width: 4rem">
                    <template #body="{ data }">
                        {{ data?.category?.name ?? '-' }}
                    </template>
                </Column>  
                <Column :header="$t('company')" style="min-width: 9rem">
                    <template #body="{ data }">
                        {{ data?.company?.name ?? '-' }}
                    </template>
                </Column>
              
           
        
                <Column field="rating" :header="$t('is_hide')" style="min-width: 10rem">
                    <template #body="{ data }" >
                        <div @click="productConfirmed(data, {is_hide: false}, 'is_not_hide')" v-if="data?.is_hide" v-tooltip.top="$t('update')+ ' '+$t('is_not_hide')" class="cursor-pointer" >
                            <Tag><i class="pi pi-check-circle"></i>{{ $t('is_hide') }}</Tag>
                        </div>
                        <div v-tooltip.top="$t('update')+ ' '+$t('is_hide')" v-else @click="productConfirmed(data,{is_hide: true}, 'is_hide')" class="cursor-pointer">
                            <Tag severity="warn"><i class="pi pi-times-circle"></i>{{ $t('is_not_hide') }}</Tag>
                        </div>

                        <!--                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />-->
                    </template>
                </Column>
                <Column :header="$t('actions')" :frozen="actions" align-frozen="left" style="min-width: 4rem">
                    <template #body="{ data }">
                        <div class="flex">
                            <!-- <Button icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="router.push({ name: 'products-info', query: { id: data.id } })" /> -->
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'products-create', params: { id: data.id } })" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                        </div>
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom v-if="meta?.total > 0" :meta="meta" @on-change-page="onChangePage" />
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
