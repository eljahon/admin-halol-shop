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
const regions = ref();
const region = ref({ id: 1, name: 'Andijon' });
const districts = ref();
const areas = ref();
const is_common = ref();
let updateValue = ref();
let isSubmit = ref(false);

const image = ref({ id: undefined, url: undefined });
const feilds = ref([
    // { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'biology_name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'planting_time_start', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'planting_time_end', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    // { label: 'crop_code', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'harvest_duration', schema: { type: 'number', required: true }, renderElement: 'InputText', prop: { type: 'number' } },
    { label: 'region', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: regions, optionLabel: 'name', optionValue: 'id', showClear: true } },
    { label: 'district', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: districts, optionLabel: 'name', optionValue: 'id', showClear: true } },
    { label: 'area', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: areas, optionLabel: 'name', optionValue: 'id', showClear: true } },
    { label: 'phone', schema: { type: 'phone', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'password', schema: { type: 'string', required: false }, renderElement: 'Password', prop: { class: 'w-full', toggleMask:true,fluid:true, feedback:false} },
    { label: 'fullname', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    // { label: 'contact_name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} }
    // { label: 'details', schema: { type: 'string', required: false }, renderElement: 'Textarea', prop: { class: '' } }
]);

const { getRegions, getDistricts, getAreas, postAreaManagers, putAreaManagers, getByIdAreaManagers } = actions(['areaManagers', 'regions', 'districts', 'areas'], { get: true, getById: true, post: true, put: true });

const isUpdate = ref(false);
getRegions({ fields: { 0: 'id', 1: 'name' } }).then((res) => {
    regions.value = res.data;
});
async function getDis(id) {
    getDistricts({ pagination: { page: 1, pageSize: 10000 }, fields: { 0: 'id', 1: 'name' }, filters: { region: { id: { $eq: id } } } }).then((res) => {
        districts.value = res.data;
    });
}

function getArae(id) {
    getAreas({
        pagination: { page: 1, pageSize: 10000 },
        fields: { 0: 'id', 1: 'name' },
        populate: '*',
        filters: {
            district: id ?? undefined
        }
    }).then((res) => {
        areas.value = res.data;
    });
}
if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdAreaManagers({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res.data };
            _data.region = _data.region?.id;
            _data.district = _data.district?.id;
            _data.area = _data.area?.id;
            // _data['contact_name'] =_data?.contact_name ?? _data?.fullname
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
        ? await putAreaManagers({
            id: values.id,
            data: {
                ...values.data
            }
        })
        : await postAreaManagers({ data: { ...values.data } });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('farmers'), detail: t('farmers') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
getDis();
getArae();
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
