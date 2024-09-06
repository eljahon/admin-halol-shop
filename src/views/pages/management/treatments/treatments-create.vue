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
let diseases = ref();
let drugs = ref();
let isSubmit = ref(false);

const icon = ref({ id: undefined, url: undefined });

const feilds = ref([
    { label: 'disease', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: diseases, optionLabel: 'name', optionValue: 'id' } },
    { label: 'drug', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: drugs, optionLabel: 'name', optionValue: 'id' } },
    { label: 'dose', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'dose_max', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } },
    { label: 'dose_min', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } }
]);

const { postTreatments, putTreatments, getDiseases, getDrugs, getByIdTreatments } = actions(['treatments', 'diseases', 'drugs'], { get: true, post: true, put: true, getById: true });

getDiseases({ pagination: { page: 1, pageSize: 25 } }).then((res) => {
    diseases.value = res.data;
});
getDrugs({ pagination: { page: 1, pageSize: 25 } }).then((res) => {
    drugs.value = res.data;
});
const isUpdate = ref(false);
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdTreatments({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            console.log(res);
            const _data = { ...res?.data };
            _data.disease = _data?.disease?.id;
            _data.drug = _data?.drug?.id;
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
        ? await putTreatments({
              id: values.id,
              data: values.data
          })
        : await postTreatments({ data: values.data });
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
            <FormBuilder v-bind="{ isSubmit, isUpdate, updateValue, feilds }" @handel-submit-form="handleSubmitFrom"> </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
