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
import VideoUpload from '@/components/Video-Upload.vue';
import SelectsIndex from '@/components/Selects/Selects-index.vue';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore();
const is_common = ref();
let updateValue = ref();
let selectData = ref();
let description = ref();
let actinName = ref({ id: '1', name: 'crops', actionName: 'crops' });
const media = ref(undefined);
const whatNews = ref([
    {
        name: t('crops'),
        actionName: 'crops',
        key: 'crop',
        id: 1
    },
    {
        name: t('diseases'),
        actionName: 'diseases',
        key: 'disease',
        id: 2
    },
    {
        name: t('drugs'),
        actionName: 'drugs',
        key: 'drug',
        id: 3
    },
    {
        name: t('fertilizers'),
        actionName: 'fertilizers',
        key: 'fertilizer',
        id: 4
    }
]);
let options = ref([]);
const textFild = ref(undefined);
const textFildRef = ref();
let isSubmit = ref(false);
function imageHandler(event) {
    console.log(event);
}
const gallery = ref(undefined);
const feilds = ref([
    { label: 'title', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'crop', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: whatNews, optionLabel: 'name', optionValue: 'id' } }
]);
const onImageUpload = (value) => {
    console.log(value);
    gallery.value = value.media;
};
const { postNews, putNews, getByIdNews } = actions(['news'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);

if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdNews({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res };
            // console.log(res);
            _data.crop_category = _data?.crop_category?.id;

            updateValue.value = _data;
            textFildRef.value = _data.details;
            setTimeout(() => {
                options.value = [
                    { name: 'test', id: 1 },
                    { name: 'test 2', id: 2 }
                ];
            });

            // const itemHtml = textFildRef.value.quill?.clipboard.convertHTML(_data.details);
            //   textFildRef.value.quill.setContents(itemHtml);
            //   textFildRef.value.quill.setSelection(itemHtml.length());
            is_common.value = res['is_common'];
            isUpdate.value = false;
            image.value = res.main_image;
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
async function handleSubmitFrom(values) {
    isSubmit.value = true;

    const relation = {id: actinName.value.id, model: 'relation'}
    console.log(relation, gallery);
    const data = values.id
        ? await putNews({
              id: values.id,
              data: {
                  ...values.data,
                  gallery: [gallery.value.id],
                  media: media.value.id,
                  content: textFild.value,
                  [actinName.value?.key]: selectData.value,
                  description: description.value
              }
          })
        : await postNews({ data: { ...values.data, gallery: gallery.value?.id ? [gallery.value?.id] :undefined, media: media.value?.id, content: textFild.value, [actinName.value?.key]: selectData?.value, description: description?.value, relation } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('crops'), detail: t('crops') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
    actinName.value = whatNews.value.find((el) => el.id === value);
}
function onImageUploadVideo(value) {
    videoList.value = value.media?.aws_path;
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom" :methods="[, updateEditor]">
                <template #default="{ values, set }">
                    <div class="flex gap-2">
                        <div class="w-full">
                            <label for="crop my-2">{{ $t(actinName?.name) }}</label>
                            <SelectsIndex id="crop" v-model="selectData" class="w-full" :actionName="actinName?.actionName" filter-name="name" />
                        </div>
                        <div class="w-full">
                            <label for="des" class="block">{{ $t('crops') }}</label>
                            <Textarea id="des" class="w-full" v-model="description" />
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <div class="w-1/2 flex justify-around gap-10">
                            <div class="w-full flex">
                                <ImageUpload :folder="'crops'" :model-value="gallery?.aws_path" @update:modelValue="onImageUpload" />
                            </div>
                            <div class="w-full"><VideoUpload folder="news" :modelValue="media?.aws_path" @update:modelValue="onImageUploadVideo" /></div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <CustomEditor v-model="textFild" :model-value="textFildRef" />
                    </div>
                </template>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
