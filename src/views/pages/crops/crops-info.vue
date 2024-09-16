<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import dayjs from 'dayjs';
import ImageOnLoad from '@/components/ImageOnLoad.vue';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import { useToast } from 'primevue/usetoast';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const activeteTemplate = ref();
const updateValue = ref();
const cropById = ref();
const meta = ref();
const crop = ref();
const deleteCropDialog = ref();
const isLoading = ref(false);
const isLoadingTabel = ref(false);
const openForm = ref(false);
const { getByIdCrops, getActivityTemplates, deleteActivityTemplates } = actions(['crops', 'activityTemplates'], { get: true, post: true, put: true, getById: true, remove: true });
async function getByIdCrop() {
    isLoading.value=true
    return await getByIdCrops({ id: route.query.id, query:{populate: '*'} }).then((res) => {
        console.log(res);
        cropById.value = res;
        isLoading.value =false
        return res;
    });
}
async function getActiviterTemplate() {
    isLoadingTabel.value = true;
    const filters = { crop: { id: route.query.id } };
    const sort = { id: 'asc', start_date: 'asc', end_date: 'asc' };
    const pagination = { page: route.query?.page ?? 1, pageSize: route.query?.pageSize ?? 10 };
    return await getActivityTemplates({ filters, populate: '*', sort, pagination })
        .then((res) => {
            isLoadingTabel.value = false;
            activeteTemplate.value = res.data;
            console.log(res);
            meta.value = res.meta;
            return res;
        })
        .catch((err) => {
            isLoadingTabel.value = false;
        });
}
function onChangePage(event) {
    // console.log(event);
    getActiviterTemplate();
}
function confirmDeleteProduct(prod) {
    crop.value = prod;
    deleteCropDialog.value = true;
}
function openNew() {
    openForm.value = true;
}
function edit(data) {
    console.log(data);
    const _data = JSON.parse(JSON.stringify(data));
    console.log(_data);
    _data.crop = _data.crop.id;
    _data.activity_type = _data.activity_type.id;
    openForm.value = true;
    setTimeout(() => {
        updateValue.value = _data;
    }, 0);
}
function deleteProduct() {
    deleteCropDialog.value = false;
    isLoading.value = true;
    deleteActivityTemplates(crop.value.id)
        .then((res) => {
            crop.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: t('activity-templates') + ' ' + t('delete'), life: 3000 });
            isLoading.value = false;
            getActiviterTemplate();
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            isLoading.value = false;
        });
}
function handleSubmitForm() {
    router.push({name: 'crops-create', params:{id: cropById.value.id}})
}
getByIdCrop();
getActiviterTemplate();
</script>

<template>
    <div>
        <TheBreadcrumb />

        <div>
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-4">
<div class="card">
    <div class="image">
           <div class="">
               <ImageOnLoad class="mx-auto" v-if="cropById?.main_image?.aws_path" v-bind="{src:cropById?.main_image?.aws_path, height: 200, width:200}"/>
               <h3 class="text-center">{{cropById?.name}}</h3>
           </div>
        <h1 class="text-xl text-primary">{{$t('details')}}</h1>
        <div>
            <h1 v-if="!isLoading" class="my-4">{{$t('name')}}: {{cropById?.name?? '-'}}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>
            <h1 v-if="!isLoading" class="my-4">{{$t('biology_name')}}: {{cropById?.biology_name?? '-'}}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <h1 v-if="!isLoading" class="my-4">{{$t('description')}}: {{cropById?.description?? '-'}}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <h1 v-if="!isLoading" class="my-4">{{$t('crop_code')}}: {{cropById?.crop_code?? '-'}}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <h1 v-if="!isLoading" class="my-4">{{$t('season')}}: {{cropById?.season ? cropById.season.title : "-" }}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <h1 v-if="!isLoading" class="my-4">{{$t('unit')}}: {{ cropById?.unit ? cropById.unit?.name : "-" }}</h1>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <p v-if="!isLoading" class="my-4">
                <div>
                {{$t('details')}}
            </div>
                <br>
                <p v-html="cropById?.details"></p></p>
            <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

            <div v-if="!isLoading" class="mt-5 flex gap-4 justify-end w-full">
                <Button severity="secondary" class="w-1/2" @click="router.go(-1)"  type="button" :label="$t('cancel')"/>
                <Button  class="w-1/2" @click="handleSubmitForm"  :label="$t('edit')"/>
            </div>
            <Skeleton class="mt-3" v-else width="100%" height="5rem"/>

        </div>
        </div>
    </div>
                </div>
                <div class="col-span-8">

                    <DataTable ref="dt" :value="activeteTemplate" dataKey="id" :loading="isLoadingTabel">
                        <template #header>
                            <div class="w-full flex justify-end">
                                <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                            </div>
                        </template>
                        <Column field="id" :header="$t('id')">
                            <template #loading>
                                <div class="flex items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
                                    <Skeleton width="60%" height="1rem" />
                                </div>
                            </template>
                        </Column>
                        <Column field="price" :header="$t('crops')" style="min-width: 9rem">
                            <template #body="{ data }">
                                {{ data?.crop?.name ?? '-' }}
                            </template>
                        </Column>
                        <Column field="category" :header="$t('start_date')" style="min-width: 7rem">
                            <template #body="{ data }">
                                <span v-if="data.start_date">{{ dayjs(data.start_date).format('DD-MM-YYYY') }}</span>
                                <span v-else class="text-red-500">{{ '--' }}</span>
                            </template>
                        </Column>
                        <Column field="category" :header="$t('end_date')" style="min-width: 7rem">
                            <template #body="{ data }">
                                <span v-if="data.end_date">{{ dayjs(data.end_date).format('DD-MM-YYYY') }}</span>
                                <span v-else class="text-red-500">{{ '--' }}</span>
                            </template>
                        </Column>
                        <Column field="inventoryStatus" :header="$t('cycle')" style="min-width: 9rem">
                            <template #body="{ data }">
                                <span class="text-primary">{{ data.cycle }}</span>
                            </template>
                        </Column>
                        <Column style="min-width: 10rem">
                            <template #header>
                                <div class="items-end">{{ $t('actions') }}</div>
                            </template>
                            <template #body="{ data }">
                                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edit(data)" />
                                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                            </template>
                        </Column>
                        <template #footer>
                            <PaginatorCustom :meta="meta" @on-change-page="onChangePage" />
                        </template>
                    </DataTable>
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
                    <Dialog v-model:visible="openForm" :style="{ width: '450px' }" :modal="true">
                        <template #header>
                            <h1 class="text-3xl text-center">{{ $t('activity-templates') }} {{ $t('add') }}</h1>
                        </template>
                        <div class="w-full">
                            <AtiviteTemplateForm
                                @cloesModal="
                                    () => {
                                        openForm = false;
                                        getActivityTemplates();
                                    }
                                "
                                :hideTitle="false"
                                :updateValue="updateValue"
                            />
                        </div>
                    </Dialog>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
