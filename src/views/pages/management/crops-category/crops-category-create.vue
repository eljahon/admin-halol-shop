<script setup>
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import ImageUpload from '@/components/imageUpload.vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { actions } from '@/utils/Store_Schema';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore();
let updateValue = ref();
let isSubmit = ref(false);
const crops = ref([]);
const icon = ref({ id: undefined, url: undefined });

const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'iconpath', schema: { type: 'string' }, renderElement: 'InputText', prop: {} },
    { label: 'code', schema: { type: 'string' }, renderElement: 'InputText', prop: {} },

    { label: 'crop', schema: { type: 'string' }, renderElement: 'Select', prop: { options: crops, optionLabel: 'name', optionValue: 'id' } }
]);
const onImageUpload = (value) => {
    console.log(value);
    icon.value = value.media;
};
const { postCropsCategory, putCropsCategory, getByIdCropsCategory, getCrops } = actions(['cropsCategory', 'crops'], { get: true, post: true, put: true, getById: true });

const isUpdate = ref(false);

getCrops({ pagination: { page: 1, pageSize: 25 } }).then((res) => {
    crops.value = res.data;
});
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdCropsCategory({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res?.data };
            _data.crop = _data?.crop?.id;
            updateValue.value = _data;
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
        ? await putCropsCategory({
              id: values.id,
              data: {
                  ...values.data,
                  icon: icon?.value?.id
              }
          })
        : await postCropsCategory({ data: { ...values.data, icon: icon.value.id } });
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
            <FormBuilder  v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom">
                <template #default="{ values, set }">
                    <div class="w-full flex">
                        <ImageUpload :forlder="'other'" :model-value="icon?.aws_path" @update:modelValue="onImageUpload" />
                    </div>
                </template>
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
