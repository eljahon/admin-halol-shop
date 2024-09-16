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
const activityYears = ref();
const comment = ref();
const is_common = ref();
let isSubmit = ref(false);
const props = defineProps(['hideTitle', 'updateValue']);
const emit = defineEmits(['cloesModal'])
const feilds = ref([
    { label: 'activity_type', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'cycle', schema: { type: 'number', required: true }, renderElement: 'InputNumber', prop: {} },
    { label: 'start_date', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'start_year', schema: { type: 'string', required: false }, renderElement: 'Select', prop: { options: activityYears, optionLabel: 'name', optionValue: 'value' } },
    { label: 'end_date', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'end_year', schema: { type: 'string', required: false }, renderElement: 'Select', prop: { options: activityYears, optionLabel: 'name', optionValue: 'value' } }
]);
const {getActivityTypes, getActivityYears,postActivityTemplates, putActivityTemplates } = actions(['crops', 'activityTypes', 'activityYears', 'activityTemplates'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);
getActivityTypes({ pagination: { page: 1, pageSize: 1000 } }).then((res) => {
    cropsCategory.value = res.data;
});
getActivityYears({ pagination: { page: 1, pageSize: 1000 } }).then((res) => {
    activityYears.value = res.data;
});
async function handleSubmitFrom(values) {
    isSubmit.value = true;
    console.log(values);
    const _data={
        ...values.data,
        start_year:values.data.start_year > 0 ?values.data.start_year : 0 ,
        end_year:values.data.end_year > 0 ?values.data.end_year : 0 ,
        start_date: dayjs(values.data.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(values.data.end_date).format('YYYY-MM-DD'),
        crop: +route.query.id,
        comment: comment.value

    }
    console.log(_data);
    const data = values?.data?.id
        ? await putActivityTemplates({
              id: values.data.id,
              data: _data
          })
        : await postActivityTemplates({ data: _data });
    if (data) {
        emit('cloesModal')
        // router.go(-1);
        toast.add({ severity: 'success', summary: t('activity-templates'), detail: t('activity-templates') + ' ' + values?.data?.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
}
const itemSelect = ref();
</script>

<template>
    <div>
        <!--        <TheBreadcrumb />-->
        <div class="card w-full">
            <FormBuilder grid-class="grid grid-cols-2 w-full" v-bind="{ isSubmit, isUpdate, updateValue, feilds, hideTitle }" @handel-submit-form="handleSubmitFrom" :methods="[, , , , , , , , updateEditor]">
                <label>{{ $t('comment') }}</label>
                <Textarea class="w-full" v-model="comment" />
            </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
