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
import CustomEditor from '@/components/Editor/editor.vue'
import VideoUpload from '@/components/Video-Upload.vue';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore();
const cropsCategory = ref();
// const is_common = ref();
let updateValue = ref();
// const videoList =ref(undefined)
const images =ref(undefined)
// const whatNews = ref([
//     {
//         name: "Crops",
//         id: 1
//     },
//     {
//         name: "Diseases",
//         id: 2
//     },
//     {
//         name: "Drugs",
//         id: 3
//     },
//     {
//         name: "Fertilizers",
//         id: 4
//     }
// ]);
// let options = ref([]);
// const textFild = ref(undefined)
// const textFildRef = ref()
let isSubmit = ref(false);
let isVideo = ref(true);
let isImage = ref(true);

// const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    { label: 'title', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'biology_name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'planting_time_start', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'planting_time_end', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'crop_code', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'harvest_duration', schema: { type: 'number', required: true }, renderElement: 'InputNumber', prop: {} },
    { label: 'crop', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'description', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } },
    // { label: 'details', schema: { type: 'string', required: false }, renderElement: 'Editor', prop: { class: 'w-full h-full' } },
]);

const { postReels,putReels, getCrops, getByIdReels } = actions(['crops', 'reels'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);
getCrops({pagination:{page: 1, pageSize: 1000}}).then((res) => {
    cropsCategory.value = res.data;
});
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdReels({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res };
            console.log(_data);
            _data.crop = _data.crop?.id
            updateValue.value = _data;
            images.value = _data?.media;
            console.log(_data.media?.aws_path.includes('mp4'));
            if(!(_data.media?.aws_path.includes('mp4'))) {
                isImage.value = true
                isVideo.value =false
            }
            else {
                isImage.value =false
                isVideo.value =true
            }
            isUpdate.value = false
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    console.log(values);
    const data = values.id
        ? await putReels({
            id: values.id,
            data: {
                ...values.data,
                media: images.value.id
            }
        })
        : await postReels({ data: { ...values.data, media: images.value.id } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('crops'), detail: t('crops') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function  updateEditor (value) {
    console.log(value);
}
function onImageUploadVideo(value) {
    isImage.value = false;
    images.value = value.media
}
const onImageUpload = (value) => {
    isVideo.value = false
    images.value = value.media;
};
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom" :methods="[,,,,,,,, updateEditor]">
                <template #default="{ values, set }">
                    <div class="flex justify-between">
                        <div class=" w-1/2 flex justify-around gap-10">
                            <div class="w-full flex">
                                <ImageUpload v-if="isImage" :folder="'crops'" :model-value="images?.aws_path" @update:modelValue="onImageUpload" />
                            </div>
                            <div class="w-full">
                                <VideoUpload v-if="isVideo" folder="news" :modelValue="images" @update:modelValue="onImageUploadVideo"/></div>
                        </div>

                    </div>
                    <div class="mt-4">

<!--                        <CustomEditor v-model="textFild"  :model-value="textFildRef"/>-->
                    </div>
                </template>
            </FormBuilder>

        </div>

    </div>
</template>

<style scoped lang="scss"></style>
