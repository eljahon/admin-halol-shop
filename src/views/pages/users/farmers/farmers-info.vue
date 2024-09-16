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
const router = useRouter();
const route = useRoute();
const store = useStore();
const toast = useToast()
const {t} = useI18n()
const farmersList = ref();
const isPoligonAdd = ref(false);
const isSubmit = ref(false);
const totalHectare = ref(0);
const polygon = ref([]);
const centerInline = ref([]);
const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'description', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);
const zoomInline = ref()
const sendData = ref({
    area: +route.query?.area,
    district: +route.query?.district,
    region: +route.query?.region,
    farmer: +route.query?.fid,
    name: '',
    polygon: {
    type: "Feature",
        properties: {},
    geometry: {
        coordinates: [],
            type: "Polygon"
    }
},
    hectar: 0,
    center: []
})
const { getFields,postFields } = actions(['fields'], { get: true, post: true, put: true });
async function getLand() {
    // isLoading.value =true
    const _query = { ...route.query };
    delete _query.fid;
    return await store
        .dispatch('getLandMonitoring', _query)
        .then((res) => {
            const { data, zoom, center } = res;
            let cor = [];
            zoomInline.value = zoom;
            centerInline.value = center
            // farmers.value = res.data
            data.forEach((el) => {
                el.fields.forEach((e) => {
                    cor.push({ ...e, fid: el.id });
                });
            });
            polygon.value = cor || [];
            // zoom.value = res.zoom;
            // if (res.center[1] && res.center[0]) center.value = [res.center[0],res.center[1]]
            // isLoading.value=false
            return res;
        })
        .catch((err) => {
            // isLoading.value=false
        });
}
function getFarmers() {
    const filters = { farmer: route.query?.fid ?? undefined };
    const sort = {id: 'desc'}
    getFields({ filters, sort }).then((res) => {
        console.log(res);
        farmersList.value = res.data;
        res.data.forEach(el => {
            totalHectare.value+=el.hectar
        })
    });
}
function openNew () {
    isPoligonAdd.value =true
}
function handleSubmitFrom(values) {
    console.log(values);
    isSubmit.value = true
    sendData.value.name = values.data.name;
    postFields({data: sendData.value})
        .then(res => {
            isSubmit.value =false;
            isPoligonAdd.value =false;
            toast.add({ severity: 'success', summary: t('fields'), detail: t('fields') + ' ' + t('create'), life: 3000 });
            getLand()
            getFarmers()
        })
        .catch(err => {
            isSubmit.value =false
        })

}
function cropCoords(values) {
    console.log(values);
    sendData.value.center = values?.center;
    sendData.value.hectar = values?.hectar;
    sendData.value.polygon.geometry.coordinates =values.polygon
}
getFarmers();
getLand();
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="">
            <div class="flex justify-end"></div>
            <div class="grid grid-cols-12 gap-4">
                <div class="map sm:col-span-12 xl:col-span-8 bg-white dark:bg-blue-400/10">
                    <div class="">
                        <Ymaps @cropCoords="cropCoords" :zoom="zoomInline" :center="centerInline" :is-poligon-add="isPoligonAdd" :poligons="polygon" />
                    </div>
                </div>
                <div class="info sm:col-span-12 xl:col-span-4 grid grid-row-12">
                    <div class="rounded">
                        <div class="bg-white dark:bg-blue-400/10">
                            <div v-if="!isPoligonAdd">
                                <div class="flex justify-between px-2 items-center"><span class="text-primary">{{$t('total-hectare-h')}} <b>{{(totalHectare/10000).toFixed(2)}}</b> {{ $t('hectare') }}</span><Button label="New" icon="pi pi-plus" severity="success" class="mr-2 mt-3" @click="openNew" /></div>
                                <div class="px-2 overflow-y-auto" style="max-height: 400px">
                                    <div v-for="(item, index) in farmersList" :key="item.id" class="mt-2">
                                        <div class="flex items-center gap-2 p-2 shadow-custom rounded cursor-pointer">
                                            <i class="pi pi-spin pi-stop-circle text-primary" style="font-size: 2rem"></i>
                                            <div class="flex justify-between gap-4"><span>{{item.name}} </span><span class="text-center text-primary">{{(item.hectar/10000).toFixed(2)}} {{$t('hectare')}}</span></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div v-else class="p-3">
                                <FormBuilder grid-class="grid grid-col-12" v-bind="{ isSubmit, feilds }" @handel-submit-form="handleSubmitFrom"> </FormBuilder>

                            </div>
                        </div>
                    </div>
                    <div class="row-span-6 overflow-y-auto">
                        <div class="w-full bg-white dark:bg-blue-400/10 h-full">
                            <h1>dsfsd</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
