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

const { getFarmers, deleteFarmers, getRegions, getDistricts, getAreas } = actions(['farmers', 'regions', 'districts', 'areas'], { get: true, remove: true });
// console.log(action, 'list');
function openNew() {
    router.push({ name: 'farmers-create', params: { id: 'new' } });
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

function onChangeSelect(value) {
    routerPush({ is_common: value, page: 1 });
}

// let onSearch = debounce(function(value) {
//     routerPush({ search: value.target?.value ? value.target?.value : undefined, page: 1 });
// }, 1500)
function getCropsList() {
    isLoading.value = true;
    const _query = { ...route.query };
    const filters = {
        populate: '*',
        sort: 'createdAt:desc',
        pagination: { page: _query?.page ? +_query?.page : 1, pageSize: _query.pageSize ? +_query.pageSize : 25 },
        region: _query.region ?? undefined,
        district: _query.district ?? undefined,
        area: _query.area ?? undefined
    };
    return getFarmers(filters)
        .then((res) => {
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
async function getAreasList() {
    const _query = { ...route.query };
    return await getAreas({populate: '*', district:_query.district ?? undefined}).then((res) => {
        areas.value = res.data;
    });
}
async function getDistrictList() {
    const _query = { ...route.query };
    return await getDistricts({ populate: '*', filters: { region: { id: _query.region ?? undefined } } }).then((res) => {
        districts.value = res.data;
    });
}
async function getRegionsList() {
    const _query = { ...route.query };

    return await getRegions({ populate: '*' }).then((res) => {
        regions.value = res.data;
    });
}
getCropsList();
getRegionsList();
getDistrictList();
getAreasList();
async function filterAreas(value) {
    if(value) {
        await routerPush({ area: value });
    } else {
        await routerPush({ area: undefined });
    }
}
async function filterDistrict(value) {
    if (value) {
        await routerPush({ district: value });
        await getAreas();
    } else {
        await routerPush({ district: undefined });
        await getAreas();
    }
}
async function filterRegion(value) {
    if (value) {
        await routerPush({ region: value });
        await getDistricts();
    } else {
        await routerPush({ region: undefined });
        await getDistricts();
    }
}
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
                        <Select class="w-full md:w-56" v-model="region" :placeholder="$t('region')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterRegion" :options="regions"> </Select>
                        <Select class="w-full md:w-56" v-model="district" :placeholder="$t('district')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterDistrict" :options="districts"> </Select>
                        <Select class="w-full md:w-56" v-model="area" :placeholder="$t('area')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterAreas" :options="areas"> </Select>
                        <!--                        <IconField>-->
                        <!--                            <InputIcon>-->
                        <!--                                <i class="pi pi-search" />-->
                        <!--                            </InputIcon>-->
                        <!--                            <InputText v-model="search" :placeholder="$t('search-by-name')" @input="onSearch" />-->
                        <!--                        </IconField>-->
                    </div>
                </div>
                <div class="flex gap-2">
                    <!--                    <Button label="Export" icon="pi pi-upload" severity="success" @click="excelDownload" />-->
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                </div>
            </div>
            <DataTable ref="dt" :value="crops" dataKey="id" :loading="isLoading">
                <template #header> </template>
                <Column field="id" :header="$t('id')">
                    <!--                    <template #loading>-->
                    <!--                        <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">-->
                    <!--                            <Skeleton width="60%" height="1rem" />-->
                    <!--                        </div>-->
                    <!--                    </template>-->
                </Column>
                <Column :header="$t('region-district-area')" style="min-width: 16rem">
                    <template #body="{ data }">
                        <!--                        {{data}}-->
                        <span class="text-primary">{{ data?.region?.name }}</span
                        >, <span class="text-primary">{{ data?.district?.name }}</span
                        >, <span class="text-primary">{{ data?.area?.name }}</span>
                        <!--                        <ImageOnLoad width="90" :src="data?.main_image?.aws_path" />-->
                    </template>
                </Column>
                <Column field="farmer_name" :header="$t('farmer-name')" style="min-width: 8rem"></Column>
                <Column field="fullname" :header="$t('farmer-manger')" style="min-width: 8rem"></Column>
                <Column field="phone" :header="$t('phone')" style="min-width: 10rem"></Column>

                <Column field="field_area" :header="$t('hectare')" style="min-width: 9rem">
                    <template #body="{ data }">
                        <Tag>{{ (data?.field_area / 10000).toFixed(2) ?? '-' }} {{ $t('hectare') }}</Tag>
                    </template>
                </Column>
                <!--                <Column field="category" :header="$t('planting_time_start')" style="min-width: 12rem; text-align: center">-->
                <!--                    <template #body="{ data }">-->
                <!--                        <span v-if="data.planting_time_start">{{ dayjs(data.planting_time_start).format('DD-MM-YYYY') }}</span>-->
                <!--                        <span v-else class="text-red-500">{{ '&#45;&#45;' }}</span>-->
                <!--                    </template>-->
                <!--                </Column>-->
                <!--                <Column field="rating" :header="$t('planting_time_end')" style="min-width: 12rem; text-align: center">-->
                <!--                    <template #body="{ data }">-->
                <!--                        <span v-if="data.planting_time_end">{{ dayjs(data.planting_time_end).format('DD-MM-YYYY') }}</span>-->
                <!--                        <span v-else class="text-red-500">{{ '&#45;&#45;' }}</span>-->
                <!--                        &lt;!&ndash;                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />&ndash;&gt;-->
                <!--                    </template>-->
                <!--                </Column>-->
                <!--                <Column field="inventoryStatus" :header="$t('active')" style="min-width: 12rem">-->
                <!--                    <template #body="slotProps">-->
                <!--                        <Tag :value="slotProps.data.is_common ? $t('is_main') : $t('is_main_not')" :severity="getStatusLabel(slotProps.data.is_common)" />-->
                <!--                    </template>-->
                <!--                </Column>-->
                <Column :header="$t('actions')" :frozen="actions" align-frozen="left" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" outlined rounded severity="info" class="mr-2" @click="router.push({ name: 'farmers-info', query: { id: data.id } })" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="router.push({ name: 'farmers-create', params: { id: data.id } })" />
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
