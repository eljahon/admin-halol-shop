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

const icon = ref({ id: undefined, url: undefined });

const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'biology_name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'planting_time_start', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'planting_time_end', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'crop_code', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'harvest_duration', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } },
    // { label: 'crop_category', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'description', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);
const onImageUpload = (value) => {
    console.log(value);
    icon.value = value.media;
};
const { postActivityTypes, putActivityTypes,getByIdActivityTypes } = actions(['activityTypes'], {post: true, put: true, getById: true });
const isUpdate = ref(false);
console.log(store);
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdActivityTypes({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            console.log(res);
            updateValue.value = res.data;
            isUpdate.value = false;
            icon.value = res.data.icon;
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const data = values.id
        ? await putActivityTypes({
            id: values.id,
            data: {
                ...values.data,
                icon: icon.value.id
            }
        })
        : await postActivityTypes({ data: { ...values.data, icon: icon.value.id } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('activity_types'), detail: t('crops') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder gridClass="grid grid-cols-1 w-1/2" v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom">
                <template #default="{ values, set }">
<!--                    <div class="flex gap-3">-->
<!--                        <label>{{ $t('is_common') }}</label>-->
<!--                        <ToggleSwitch v-model="is_common"></ToggleSwitch>-->
<!--                    </div>-->
                    <div class="w-full flex">
                        <ImageUpload :forlder="'other'" :model-value="icon?.aws_path" @update:modelValue="onImageUpload" />
                    </div>
                </template>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
