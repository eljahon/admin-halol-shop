<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, watch } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import ImageUpload from '@/components/imageUpload.vue';
import { useToast } from 'primevue/usetoast';
// import Editor from 'primevue/editor';
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import CustomEditor from '@/components/Editor/editor.vue';
import WithoutAddresYandexMaps from '@/components/Ymaps/without-addres-yandex-maps.vue';
const { t } = useI18n();
const router = useRouter();

const toast = useToast();
const store = useStore();

let updateValue = ref();

const coords = ref(undefined);
let isSubmit = ref(false);

const feilds = ref([
    { label: 'app_store_link', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'play_market_link', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'banner_title', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'email', schema: { type: 'email', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'phone', schema: { type: 'phone', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'website', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'banner_description', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } },
    { label: 'address', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);
const { postMainInfo, putMainInfo, getMainInfo, getByIdMainInfo } = actions(['mainInfo'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);

function fetchMainInfo() {
    isUpdate.value =true
    getMainInfo()
        .then((res) => {
            const _data = { ...res.data };
            updateValue.value = _data;
            coords.value = [_data.location.lat, _data.location.long];
            isUpdate.value = false
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
const getLocation = (e) => {
    coords.value =[e[0], e[1]]
}
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const _data ={...values.data, location:{lat:coords.value[0], long: coords.value[1]}}
    const data =await store.dispatch('putMainIfo', _data)
    if (data) {
        toast.add({ severity: 'success', summary: t('main_info'), detail: t('main_info') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        fetchMainInfo()
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
}
fetchMainInfo()
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder grid-class="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2" v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom" :methods="[, , , , , , , , updateEditor]">
                <div class="w-full h-64">
                    <WithoutAddresYandexMaps :coordinata="coords" :get-location="getLocation" />
                </div>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
