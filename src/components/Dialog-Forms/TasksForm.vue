<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
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
const comment = ref();
let isSubmit = ref(false);
const props = defineProps(['hideTitle', 'updateValue', 'location']);
const emit = defineEmits(['cloesModal', 'refetch'])
const {getEmployees, getTasks, postTasks, putTasks} = actions(['employees', 'tasks'], { get: true, post: true, put: true, getById: true });
const feilds = ref([
    { label: 'title', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'employee', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'fullname', optionValue: 'id' } },
    { label: 'start_date', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
    { label: 'end_date', schema: { type: 'date', required: true }, renderElement: 'DatePicker', prop: { showIcon: true, fluid: true, iconDisplay: 'input', dateFormat: 'dd-mm-yy' } },
]);
const isUpdate = ref(false);
function getEmpoyessList () {
    // console.log(store);
    // store.dispatch('getEmployess')
    //     .then(res => {
    //         console.log(res);
    //     })
    return getEmployees({ pagination: { page: 1, pageSize: 1000 } }).then((res) => {
        cropsCategory.value = res.data;
        console.log(res.data);
    });
}

async function handleSubmitFrom(values) {
    isSubmit.value = true;
    console.log(values);
    const _data={
        ...values.data,
        start_date: dayjs(values.data.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(values.data.end_date).format('YYYY-MM-DD'),
        field: +route.query.id,
        description: comment.value,
        location: props.location

    }
    const data = values?.data?.id
        ? await putTasks({
              id: values.data.id,
              data: _data
          })
        : await postTasks({ data: _data });
    if (data) {
        emit('refetch')
        emit('cloesModal')
        toast.add({ severity: 'success', summary: t('task'), detail: t('task') + ' ' + values?.data?.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
}
getEmpoyessList()
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
