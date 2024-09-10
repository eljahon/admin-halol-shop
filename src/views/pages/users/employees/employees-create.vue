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
let roles = ref();
let farmers = ref();
let isSubmit = ref(false);
// fullname: "",
//     phone: "",
//     about: "",
//     farmer: undefined,
//     employee_role: undefined
const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    { label: 'fullname', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'phone', schema: { type: 'phone', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'role', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: roles, optionLabel: 'name', optionValue: 'id' } },
    { label: 'farmer', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: farmers, optionLabel: 'fullname', optionValue: 'id' } },
    { label: 'about', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
]);

const {postEmployees,getFarmers, putEmployees, getByIdEmployees, getEmployeeRoles } = actions(['employees', 'employeeRoles', 'farmers'], { get: true, getById: true, post: true, put: true });

const isUpdate = ref(false);
getEmployeeRoles()
    .then(res => {
        roles.value=res.data;
    })

getFarmers()
    .then(res => {
        farmers.value = res.data;
    })

if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdEmployees({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res.data };
            _data['role'] = _data.employee_role?.id
            _data.farmer = _data.farmer?.id
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
        ? await putEmployees({
            id: values.id,
            data: {
                ...values.data,
                employee_role: values.data.role
            }
        })
        : await postEmployees({ data: { ...values.data, employee_role: values.data.role } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('employees'), detail: t('employees') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
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
