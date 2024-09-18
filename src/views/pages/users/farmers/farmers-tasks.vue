<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import Ymaps from '@/components/Ymaps/ymaps.vue';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useStore } from 'vuex';
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Plating from '@/assets/svg/platings.svg';
import FieldAddCrops from '@/components/Dialog-Forms/FieldAddCrops.vue';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import dayjs from 'dayjs';
import EmptyBox from '@/components/EmptyBox.vue';
import TasksForm from '@/components/Dialog-Forms/TasksForm.vue';
const router = useRouter();
const route = useRoute();
const store = useStore();
const toast = useToast();
const { t } = useI18n();
const farmersList = ref();
const isPoligonAdd = ref(false);
const isSubmit = ref(false);
const plantingDialog = ref(false);
const taskDialog = ref(false);
const plantingLoading = ref(false);
const tasksLoading = ref(false);
const itemFild = ref(undefined);
const polygon = ref(undefined);
const locationList = ref(undefined);
const centerInline = ref([]);
const plantingList = ref([]);
const tasksList = ref([]);
const plantingMeta = ref({});
const tasksMeta = ref({});
const zoomInline = ref();
const sendData = ref({
    area: +route.query?.area,
    district: +route.query?.district,
    region: +route.query?.region,
    farmer: +route.query?.fid,
    name: '',
    polygon: {
        type: 'Feature',
        properties: {},
        geometry: {
            coordinates: [],
            type: 'Polygon'
        }
    },
    hectar: 0,
    center: []
});
const { getFields, getByIdFields, getPlantings, getTasks, postSevenday } = actions(['fields', 'tasks', 'plantings', 'sevenday'], { get: true, post: true, put: true, getById: true });
function getFarmers() {
    const filters = { farmer: route.query?.fid ?? undefined };
    const sort = { id: 'desc' };
    return getByIdFields({ id: route.query.id, query: { popluate: '*' } }).then((res) => {
        polygon.value = [{ name: res.data.name, polygon: res.data.polygon, fid: res.data.id }];
        centerInline.value = res.data.center;
        farmersList.value = res.data;
        locationList.value ={lat: res.data.center[1], long: res.data.center[0]}
        postSevenday({...locationList.value})
            .then(res => {
                console.log('wether ', res);
            })
    });
}
function openNew() {
    isPoligonAdd.value = true;
}
function getPlatingList() {
    const filters = { field: route.query.id };
    plantingLoading.value = true;
    return getPlantings({ filters, popluate: '*' })
        .then((res) => {
            plantingList.value = res.data;
            plantingMeta.value = res.meta;
            plantingLoading.value = false;
        })
        .catch((err) => {
            plantingLoading.value = false;
        });
}
function getTaskList() {
    tasksLoading.value = true;
    const filters = { field: route.query.id };
    return getTasks({ filters, populate: '*' }).then((res) => {
        tasksList.value = res.data;
        tasksMeta.value = res.meta;
        tasksLoading.value = false;
        // locationList.value = res.data[0].location
    });
}

function cropCoords(values) {
    console.log(values);
    sendData.value.center = values?.center;
    sendData.value.hectar = values?.hectar;
    sendData.value.polygon.geometry.coordinates = values.polygon;
}
function newPlatingAdd() {
    plantingDialog.value = true;
}
function newTaskAdd() {
    taskDialog.value = true;
}
function onChangePage(value) {
    getPlatingList();
}
Promise.allSettled([getFarmers(), getPlatingList(), getTaskList()]);
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="">
            <div class="flex justify-end"></div>
            <div class="grid grid-cols-12 gap-4">
                <div class="map sm:col-span-12 xl:col-span-12 bg-white dark:bg-blue-400/10">
                    <div class="h-full">
                        <Ymaps :height="400 + 'px'" @cropCoords="cropCoords" :zoom="zoomInline" :center="centerInline" :poligons="polygon" />
                    </div>
                </div>
            </div>
        </div>
        <Dialog v-model:visible="plantingDialog" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('add_planting') }}</h1>
            </template>
            <FieldAddCrops :hideTitle="false" :field-id="+route.query.id" @refetch="getPlatingList" @cloes-modal="plantingDialog = false" />
        </Dialog>
        <Dialog v-model:visible="taskDialog" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('task-add') }}</h1>
            </template>
            <TasksForm :location="locationList" :hideTitle="false" :field-id="+route.query.id" @refetch="getTaskList" @cloes-modal="taskDialog = false" />
        </Dialog>
        <div class="mt-2 card">
            <div class="flex justify-end">
                <Button icon="pi pi-plus" :label="$t('planting-add')" @click="newPlatingAdd" />
            </div>
            <DataTable :value="plantingList" :loading="plantingLoading">
                <template #header>
                    <h1 class="text-primary text-2xl">{{ $t('plantings') }}</h1>
                </template>
                <template #empty>
                    <EmptyBox/>
                </template>
                <Column field="id" header="ID"></Column>
                <Column field="title" header="ID"></Column>
                <Column field="area_amount" :header="$t('area_amount')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.area_amount ?? '-' }}</span>
                    </template>
                </Column>
                <Column field="area_amount" :header="$t('harvest_planned')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.harvest_planned ?? '-' }}</span>
                    </template>
                </Column>
                <Column field="area_amount" :header="$t('harvest_amount')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.harvest_amount ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="area_amount" :header="$t('harvest_time')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.harvest_time ?? '-' }}</span>
                    </template>
                </Column>
                <Column :header="$t('planting_time')">
                    <template #body="{ data }">
                        <span>{{ dayjs(data?.planting_time).format('YYYY-MM-DD') }}</span>
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom v-if="plantingList.length" :meta="plantingMeta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
        <div class="mt-2 card">
            <div class="flex justify-end">
                <Button icon="pi pi-plus" :label="$t('task-add')" @click="newTaskAdd" />
            </div>
            <DataTable :value="tasksList" :loading="tasksLoading">
                <template #header>
                    <h1 class="text-primary text-2xl">{{ $t('tasks') }}</h1>
                </template>
                <template #empty>
                    <div class="flex justify-center items-center"><EmptyBox/></div>
                </template>
                <Column field="id" header="ID"></Column>
                <Column field="title" :header="$t('title')"></Column>
                <Column :header="$t('employee')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.employee?.fullname ?? '-' }}</span>
                    </template>
                </Column>
                <Column :header="$t('field')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.field?.name ?? '-' }}</span>
                    </template>
                </Column>
                <Column field="area_amount" :header="$t('area_amount')">
                    <template #body="{ data }">
                        <span class="text-primary">{{ data?.field.hectar ?? '-' }} {{$t('hectare')}}</span>
                    </template>
                </Column>
                <Column :header="$t('start_date')">
                    <template #body="{ data }">
                        <span>{{ dayjs(data?.start_date).format('YYYY-MM-DD') }}</span>
                    </template>
                </Column>
                <Column :header="$t('end_date')">
                    <template #body="{ data }">
                        <span>{{ dayjs(data?.end_date).format('YYYY-MM-DD') }}</span>
                    </template>
                </Column>
                <template #footer>
                    <PaginatorCustom v-if="tasksList.length" :meta="plantingMeta" @on-change-page="onChangePage" />
                </template>
            </DataTable>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
