<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import Galleria from '@/components/Galleria/Galleria.vue';
import { useRoute, useRouter } from 'vue-router';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import dayjs from 'dayjs';
import ImageOnLoad from '@/components/ImageOnLoad.vue';
import { useToast } from 'primevue/usetoast';
import store from '@/store';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const activeteTemplate = ref();
const updateValue = ref();
const cropById = ref();
const url = import.meta.env.VITE_APP_AWS_PATH
const meta = ref();
const crop = ref();
const deleteCropDialog = ref();
const dataView = ref();
const isLoading = ref(false);
const isReject = ref(false);
const isClickedReject = ref(false);
const isClickedConfirm = ref(false);
const isLoadingTabel = ref(false);
const openForm = ref(false);
const galleria = ref([{
    alt: "Description for Image 1",
    itemImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg",
    thumbnailImageSrc: "https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg",
    title: "Title 1"
}])
const { getByIdProducts,deleteProducts,deleteActivityTemplates,postProducts, putProducts } = actions(['products', 'activityTemplates'], { post: true, put: true, getById: true, remove: true });
async function getByIdCrop() {
    isLoading.value=true
    return await getByIdProducts({ id: route.query.id, query:{populate: '*'} }).then((res) => {
        dataView.value = res.data;
        galleria.value =[{
            alt: 'Description for Image 1',
            itemImageSrc: url+res.data?.image?.aws_path,
            thumbnailImageSrc: url+res.data?.image?.aws_path,
            title: 'Title 1'
        }]
        isLoading.value =false
        return res;
    })
        .catch(err => {
            isLoading.value = false
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
async function rejectPorduct () {
    isReject.value=true;
   const data =await  store.dispatch('productReject', {id: dataView.value.id});
   if(data) {
       isReject.value =false
       isClickedReject.value = false
       toast.add({ severity: 'error', summary: t('product-reject'), detail: t('product-reject'), life: 3000 });
       getByIdCrop()
       router.go(-1)
   }
}
async function productConfirmed () {
    isReject.value=true;
   const data =await  store.dispatch('productConfirmed', {id: dataView.value.id});
   if(data) {
       isClickedConfirm.value =false
       toast.add({ severity: 'success', summary: t('product-confirmed'), detail: t('product-confirmed'), life: 3000 });
       router.go(-1)
   }
}
// getActiviterTemplate();
function deleteActiveteTemplate (id) {
    deleteActivityTemplates({id})
        .then(res => {
            deleteCropDialog.value=undefined
        })
}
</script>

<template>
    <div>
        <TheBreadcrumb />

        <div>
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-8">

                    <Galleria :galleria-list="galleria"/>
                </div>
                <div class="col-span-4">
                    <div class="card h-full">
                        <div class="image h-full">
                            <h1 class="text-xl text-primary">{{$t('details')}}</h1>
                            <div class="h-full">
                                <h1 v-if="!isLoading" class="my-4">{{$t('name')}}: {{dataView?.title?? '-'}}</h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                               <div v-if="!isLoading">
                                   <span v-if="dataView?.type === 'fertilizer'" class="font-weight-medium">{{ $t('fertilizer-category') }}: </span>
                                   <span v-else class="font-weight-medium">{{ $t('drug_category') }}: </span>
                                   <span v-if="dataView?.type === 'fertilizer'"  class="text-capitalize text-body-2">{{dataView.state?.fertilizer_category?.name}}</span>
                                   <span v-else class="text-capitalize text-body-2">{{dataView.state?.drug_category?.name}}</span>
                               </div>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{$t('price')}}: {{dataView?.price?? '--'}} {{$t('som')}}</h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{$t('confir')}}:
                                    <Tag v-if="dataView.confirmed"><i class="pi pi-check-circle"></i>{{ $t('confirmed') }}</Tag>
                                    <Tag v-else severity="warn"><i class="pi pi-times-circle"></i>{{ $t('not_confirmed') }}</Tag>
                                </h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{ $t('type') }}:{{dataView?.state?.type === 'fertilizer' ? $t('fertilizer') : $t('drug')}}</h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{$t('unit')}}: {{ dataView?.unit ? dataView.unit?.name : "-" }}</h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{$t('certificate')}}: <a v-if="dataView?.cer" :href="url+dataView.cer.aws_path" target="_blank" class="text-blue-500">Link</a> <span class="text-primary" v-else>{{$t('not_certificate')}}</span></h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <p v-if="!isLoading" class="my-4">
                                    <div>
                                        {{$t('company-name')}}: <b class="text-primary">{{ dataView?.company?.name }}</b>
                                    </div>
                                    </p>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <h1 v-if="!isLoading" class="my-4">{{$t('description')}}: {{dataView?.description?? '-'}}</h1>
                                <Skeleton class="mt-3" v-else width="100%" height="1.5rem"/>

                                <div v-if="!isLoading" class="mt-5 flex gap-4 justify-end w-full">
                                    <Button :loading="isReject"  severity="secondary" class="w-1/2" @click="isClickedReject=true"  type="button" :label="$t('reject')"/>
                                    <Button v-if="!dataView.confirmed" class="w-1/2" @click="isClickedConfirm=true"  :label="$t('confirm')"/>
                                </div>
                                <Skeleton class="mt-3" v-else width="100%" height="5rem"/>
                                <Dialog v-model:visible="isClickedReject" :style="{ width: '450px' }" :modal="true">
                                    <template #header>
                                        <h1 class="text-3xl text-center text-red-500">{{ $t('reject') }}</h1>
                                    </template>
                                    <div class="flex items-center gap-4">

                                        <span class="text-primary">{{ $t('you-want-to-reject') }}  </span> <b>{{ dataView?.title }}</b>?
                                    </div>
                                    <template #footer>
                                        <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="isClickedReject = false" />
                                        <Button :label="$t('yes')" icon="pi pi-check" @click="rejectPorduct" />
                                    </template>
                                </Dialog>
                                <Dialog v-model:visible="isClickedConfirm" :style="{ width: '450px' }" :modal="true">
                                    <template #header>
                                        <h1 class="text-3xl text-center text-primary">{{ $t('confirm') }}</h1>
                                    </template>
                                    <div class="flex items-center gap-4">

                                        <span class="text-primary">{{ $t('you-want-to-confirm') }}  </span> <b>{{ dataView?.title }}</b>?
                                    </div>
                                    <template #footer>
                                        <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="isClickedConfirm = false" />
                                        <Button :label="$t('yes')" icon="pi pi-check" @click="productConfirmed" />
                                    </template>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="card my-2">
                <h3>{{ dataView?.type === 'fertilizer' ? $t('fertilizers') : $t('drugs') }}</h3>
                <Dialog v-model:visible="deleteCropDialog" :style="{ width: '450px' }" :modal="true">
                    <template #header>
                        <h1 class="text-3xl text-center text-red-500">{{ $t('remove') }}</h1>
                    </template>
                    <div class="flex items-center gap-4">
                        <i class="pi pi-exclamation-triangle !text-3xl" />
                        <span
                        >{{ $t('you-want-to-delete') }} <b>{{ deleteCropDialog?.name }}</b
                        >?</span
                        >
                    </div>
                    <template #footer>
                        <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteCropDialog = false" />
                        <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />
                    </template>
                </Dialog>
                <DataTable ref="dt" :value="dataView?.state?.items" dataKey="id" :loading="isLoadingTabel">
                    <Column style="width: 15rem;">
                        <template #header>
                            <span v-if="dataView?.type === 'fertilizer'">{{ $t('crops') }}</span>
                             <span v-else>{{ $t('disease') }}</span>
                        </template>
                        <template #body="{data}">
<!--                            <span>{{data}}</span>-->
                            <div v-if="dataView?.type === 'fertilizer'"><div  v-for="(item, index) in data.crops" :key="index">{{item.name}}</div></div>
                            <div v-else><div  v-for="(item, index) in data.diseases" :key="index">{{item.name}}</div></div>
                        </template>
                    </Column>
                    <Column field="unit" :header="$t('unit')" style="min-width: 9rem">
                        <template #body="{ data }">
                            {{ data?.unit?.name ?? '-' }}
                        </template>
                    </Column>
                    <Column field="unit" :header="$t('dose')" style="min-width: 9rem">
                        <template #body="{ data }">
                            {{ data?.dose_min}} -
                            {{data?.dose_max}} / {{ data?.unit?.key }}
                        </template>
                    </Column>
                    <Column v-if="dataView?.type === 'fertilizer'"  style="min-width: 9rem">
                        <template #header>

                            <div > {{ $t('use-count') }}</div>
                        </template>
                        <template #body="{ data }">
                            <span class="text-primary">{{ data.use_count }}</span>
                        </template>
                    </Column>
                    <Column v-if="dataView?.type === 'fertilizer'" style="max-width: 9rem">
                        <template #header>
                            <div > {{ $t('method') }}</div>
                        </template>
                        <template #body="{ data }">
                            <span class="text-primary">{{ data.method }}</span>
                        </template>
                    </Column>
                    <Column style="min-width: 10rem">
                        <template #header>
                            <div class="items-end">{{ $t('actions') }}</div>
                        </template>
                        <template #body="{ data }">
<!--                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edit(data)" />-->
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
