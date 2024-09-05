<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import FormBuilder from '@/components/Forms/FormBuilder.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
let updateValue = ref();
let isSubmit = ref(false);

const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    { label: 'fullname', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'phone', schema: { type: 'phone', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'password', schema: { type: 'string', required: route.params.id !== 'new' ?false: true }, renderElement: 'Password', prop: { class: 'w-full', toggleMask:true,fluid:true, feedback:false} }
    // { label: 'fullname', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'details', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);

const {postDistributors, putDistributors, getByIdDistributors } = actions(['distributors'], { get: true, getById: true, post: true, put: true });

const isUpdate = ref(false);

if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdDistributors({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res.data };
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
        ? await putDistributors({
            id: values.id,
            data: {
                ...values.data,
            }
        })
        : await postDistributors({ data: { ...values.data } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('distributors'), detail: t('distributors') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}

</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <FormBuilder v-bind="{ isSubmit, isUpdate, updateValue, feilds, methods: [getDis, getArae] }" @handel-submit-form="handleSubmitFrom"> </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
