<script setup>
import FormBuilder from '@/components/Forms/FormBuilder.vue';
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
let crops = ref();
let fertilizers = ref();
let isSubmit = ref(false);

const icon = ref({ id: undefined, url: undefined });

const feilds = ref([
    { label: 'crop', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: crops, optionLabel: 'name', optionValue: 'id' } },
    { label: 'fertilizer', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: fertilizers, optionLabel: 'name', optionValue: 'id' } },
    { label: 'use_count', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'method', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'dose', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'dose_max', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } },
    { label: 'dose_min', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } }
]);

const { postFertilizations, putFertilizations, getCrops, getFertilizers, getByIdFertilizations } = actions(['fertilizations', 'crops', 'fertilizers'], { get: true, post: true, put: true, getById: true });

getCrops({ pagination: { page: 1, pageSize: 25 } }).then((res) => {
    crops.value = res.data;
});
getFertilizers({ pagination: { page: 1, pageSize: 25 } }).then((res) => {
    fertilizers.value = res.data;
});
const isUpdate = ref(false);
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdFertilizations({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            console.log(res);
            const _data = { ...res?.data };
            _data.crop = _data?.crop?.id;
            _data.fertilizer = _data?.fertilizer?.id;
            updateValue.value = _data;
            isUpdate.value = false;
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
async function handleSubmitFrom(values) {
    
    isSubmit.value = true;
    const data = values.id
        ? await putFertilizations({
              id: values.id,
              data: values.data
          })
        : await postFertilizations({ data: values.data });
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
            <FormBuilder gridClass="grid grid-cols-1 w-1/2" v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom"> </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
