<!--<script setup>-->

<!--import TheBreadcrumb from '@/components/The-Breadcrumb.vue';-->
<!--import { actions } from '@/utils/Store_Schema';-->
<!--const {getAboutUs} = actions(['aboutUs'], {get:true, remove: true})-->
<!--getAboutUs({populate: '*'})-->
<!--.then(res => {-->
<!--    console.log(res);-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--    <div>-->
<!--        <TheBreadcrumb/>-->
<!--    </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->

<!--</style>-->
<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, watch } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import ImageUpload from '@/components/imageUpload.vue';
import { useToast } from 'primevue/usetoast';
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import CustomEditor from '@/components/Editor/editor.vue';
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const store = useStore();

let updateValue = ref();

const contentUpdate = ref(undefined);
const content = ref(undefined);
const images = ref(undefined);
let isSubmit = ref(false);

const feilds = ref([
    { label: 'title', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'socials', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
]);
const {putAboutUs, getAboutUs} = actions(['aboutUs'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);

function fetchMainInfo() {
    isUpdate.value =true
    getAboutUs({populate: '*'})
        .then((res) => {
            const _data = { ...res.data };
            contentUpdate.value = _data.content
            content.value = _data.content
            updateValue.value = _data;
            images.value = _data.media
            isUpdate.value = false
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}

async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const _data ={...values.data, content: content.value, media: images.value.id}
    const data =await putAboutUs({id: values.data.id,data: _data})
    if (data) {
        toast.add({ severity: 'success', summary: t('main_info'), detail: t('main_info') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        fetchMainInfo()
        isSubmit.value = false;
    } else isSubmit.value = false
}
function onImageUpload(value) {
    images.value = value.media;
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
            <FormBuilder grid-class="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2" v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom" :methods="[]">
                <div class="w-full flex">
                    <ImageUpload @delete="() => images=undefined" :folder="'crops'" :model-value="images?.aws_path" @update:modelValue="onImageUpload" />
                </div>
                <div class="w-full h-64">
                    <CustomEditor v-model="content" :model-value="contentUpdate"/>
<!--                    <WithoutAddresYandexMaps :coordinata="coords" :get-location="getLocation" />-->
                </div>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>

