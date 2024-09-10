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
let isSubmit = ref(false);
const icon = ref({ id: undefined, url: undefined });
const question_type = ref([]);
const child_question = ref([]);
const feilds = ref([
    { label: 'name', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'description', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'question_type', schema: { type: 'string' }, renderElement: 'Select', prop: { options: question_type, optionLabel: 'title', optionValue: 'id' } },
    { label: 'child_question', schema: { type: 'string' }, renderElement: 'Select', prop: { options: child_question, optionLabel: 'name', optionValue: 'id' } }
]);
const onImageUpload = (value) => {
    console.log(value);
    icon.value = value.media;
};
const { postQuestions, putQuestions, getByIdQuestions, getQuestions, getQuestionsType } = actions(['questions', 'questionsType'], { get: true, post: true, put: true, getById: true });

getQuestions().then((res) => {
    child_question.value = res.data;
});
getQuestionsType().then((res) => {
    question_type.value = res.data;
});
const isUpdate = ref(false);

if (route.params.id !== 'new') {
    isUpdate.value = true;
    getByIdQuestions({ id: route.params.id, query: { populate: '*' } })
        .then((res) => {
            const _data = { ...res?.data };
            _data.question_type = _data?.question_type?.id;
            _data.child_question = _data?.child_question?.id;
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
        ? await putQuestions({
              id: values.id,
              data: values.data
          })
        : await postQuestions({ data: values.data });
    if (data) {
        router.go(-1);
        toast.add({ severity: 'success', summary: t('activity_types'), detail: t('regions') + ' ' + values.id ? t('update') : t('create'), life: 3000 });
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
