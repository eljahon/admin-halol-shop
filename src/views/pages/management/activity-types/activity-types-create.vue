<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import ImageUpload from '@/components/imageUpload.vue';
import { useToast } from 'primevue/usetoast';
import FormBuilder from '@/components/Forms/FormBuilder.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore();
const cropsCategory = ref();
const is_common = ref();
let updateValue = ref();
let isSubmit = ref(false);

const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'biology_name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'planting_time_start', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'planting_time_end', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'crop_code', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'harvest_duration', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } },
    { label: 'crop_category', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'details', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);
const onImageUpload = (value) => {
    console.log(value);
    image.value = value.media;
};
let forms = ['name', 'biology_name', 'crop_code', 'crop_category', 'description', 'details', 'main_image', 'gallery', 'planting_time_end', 'planting_time_start', 'harvest_duration', 'is_common'];
const { postCrops, putCrops, getCropsCategory, getByIdCrops } = actions(['crops', 'cropsCategory'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);
getCropsCategory().then((res) => {
    cropsCategory.value = res.data;
});
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdCrops({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res };
            _data.crop_category = _data.crop_category.id;
            updateValue.value = _data;
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
    const data = values.id
        ? await putCrops({
            id: values.id,
            data: {
                ...values.data,
                is_common: is_common.value,
                main_image: image.value.id
            }
        })
        : await postCrops({ data: { ...values.data, is_common: is_common.value, main_image: image.value.id } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('crops'), detail: t('crops') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom">
                <template #default="{ values, set }">
                    <div class="flex gap-3">
                        <label>{{ $t('is_common') }}</label>
                        <ToggleSwitch v-model="is_common"></ToggleSwitch>
                    </div>
                    <div class="w-full flex">
                        <ImageUpload :model-value="image.aws_path" @update:modelValue="onImageUpload" />
                    </div>
                </template>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
