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
const roles = ref();
const gendor = ref();
const is_common = ref();
let updateValue = ref();
let isSubmit = ref(false);
// {
//     "provider": "local",
//     "blocked": false,
//     "confirmed": true,
//     "interests": []
// }
const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    { label: 'fullname', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'username', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'planting_time_start', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'email', schema: { type: 'email', required: true }, renderElement: 'InputText', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'crop_code', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'phone', schema: { type: 'phone', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'gender', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: gendor, optionLabel: 'name', optionValue: 'id' } },
    { label: 'role',key: 'employee_role', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: roles, optionLabel: 'name', optionValue: 'id' } },
    { label: 'password', schema: { type: 'string', required: route.params.id !== 'new' ? false : true }, renderElement: 'Password', prop: { class: 'w-full', toggleMask: true, fluid: true, feedback: false } }
]);
const onImageUpload = (value) => {
    console.log(value);
    image.value = value.media;
};
const { getGenders } = actions(['genders'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);
getGenders().then((res) => {
    gendor.value = res.data;
});
store.dispatch('getRoles').then((res) => {
    roles.value = res.filter((el) => el.type !== 'public' && el.type !== 'admin');
});
if (route.params.id !== 'new') {
    isUpdate.value = true;
    store
        .dispatch('getByIdUsers', route.params.id)
        .then((res) => {
            console.log(res);
            const _data = { ...res };
            _data.role = _data?.role?.id;
            _data.gender = _data?.gender?.id;
            updateValue.value = _data;
            // is_common.value = res['is_common'];
            isUpdate.value = false;
            // image.value = res.main_image;
        })
        .catch((err) => {
            isUpdate.value = false;
        });
}
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const data = values.id
        ? await store
              .dispatch('putUsers', {
                  id: values.id,
                  data: {
                      ...values.data
                  }
              })
              .catch((err) => {
                  // console.log(err.message);
                  // toast.add({ severity: 'error', summary: t('user'), detail: t('user') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
                  isSubmit.value = false;
              })
        : await store.dispatch('postUsers', { ...values.data, provider: 'local', blocked: false, confirmed: true, interests: [] }).catch(() => {
              isSubmit.value = false;
          });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('user'), detail: t('user') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    } else {
        // toast.add({ severity: 'error', summary: t('user'), detail: t('user') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
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
