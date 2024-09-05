<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import Password from 'primevue/password';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore();
let updateValue = ref();
let isSubmit = ref(false);
const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'description', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);

const {postEmployeeRoles, putEmployeeRoles, getByIdEmployeeRoles } = actions(['employeeRoles'], { get: true, getById: true, post: true, put: true });

const isUpdate = ref(false);
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdEmployeeRoles({ id: route.params.id, query: { populate: '*' } })
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
        ? await putEmployeeRoles({
            id: values.id,
            data: {
                ...values.data
            }
        })
        : await postEmployeeRoles({ data: { ...values.data } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('employee_roles'), detail: t('employee_roles') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
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
