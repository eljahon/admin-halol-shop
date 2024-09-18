<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, watch } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import FormBuilder from '@/components/Forms/FormBuilder.vue';
import dayjs from 'dayjs';
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const store = useStore();
const route = useRoute();
const cropsCategory = ref();
const seasonsList = ref();
let isSubmit = ref(false);
const props = defineProps(['hideTitle', 'updateValue', 'fieldId']);
const emit = defineEmits(['cloesModal', 'refetch'])
const feilds = ref([
    { label: 'crop', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'season', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: seasonsList, optionLabel: 'title', optionValue: 'id' } },
    { label: 'planting_time', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'area_amount', schema: { type: 'number', required: true }, renderElement: 'InputNumber', prop: {} },
]);
const {getCrops,getSeasons, getActivityYears,postPlantings, putActivityTemplates } = actions(['crops', 'seasons', 'plantings'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);
getCrops({ pagination: { page: 1, pageSize: 1000 } }).then((res) => {
    cropsCategory.value = res.data;
});
getSeasons({pagination:{page: 1, pageSize: 1000}})
    .then(res => {
        seasonsList.value = res.data
    })
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const _data={
        ...values.data,
        planting_time: dayjs(values.data.planting_time).format('YYYY-MM-DD'),
        field: props.fieldId,
        farmer: +route.query.fid
    }
    const data = await postPlantings({ data: _data });
    if (data) {
        emit('cloesModal')
        emit('refetch')
        toast.add({ severity: 'success', summary: t('planting-place-amount'), detail: t('planting-place-amount') + ' ' + t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
}

</script>

<template>
    <div>
        <div class="card w-full">
            <FormBuilder grid-class="grid grid-cols-2 w-full" v-bind="{ isSubmit, isUpdate, updateValue, feilds, hideTitle }" @handel-submit-form="handleSubmitFrom" :methods="[, , , , , , , , updateEditor]">
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
