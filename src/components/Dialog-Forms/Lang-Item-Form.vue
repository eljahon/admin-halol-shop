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
const toast = useToast();
const store = useStore();
const route = useRoute();
const langs = ref();
let isSubmit = ref(false);
const props = defineProps(['hideTitle', 'updateValue']);
const emit = defineEmits(['cloesModal']);
const feilds = ref([
    // { label: 'key', schema: { type: 'string', required: true }, renderElement: 'Select', prop: { options: cropsCategory, optionLabel: 'name', optionValue: 'id' } },
    { label: 'key', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} },
    { label: 'value', schema: { type: 'string', required: true }, renderElement: 'InputText', prop: {} }
]);
const { postLangItems, putLangItems, getLangs } = actions(['langItems', 'langs'], { get: true, post: true, put: true, getById: true });
const isUpdate = ref(false);

async function handleSubmitFrom(values) {
    isSubmit.value = true;
    const _data = {
        ...values.data,
        lang: route.query.localeId
    };
    const data = await postLangItems({ data: _data });
    langs.value.forEach(async (el) => {
        _data['lang'] = el.id;
        await postLangItems({ data: _data })
    })
    if (data) {
        emit('cloesModal');
        // router.go(-1);
        toast.add({ severity: 'success', summary: t('activity-templates'), detail: t('activity-templates') + ' ' + values?.data?.id ? t('update') : t('create'), life: 3000 });
        isSubmit.value = false;
    }
}
function updateEditor(value) {
    console.log(value);
}
async function getLansList() {
    return await getLangs({ filters: { id: { $ne: route.query?.localeId ?? undefined } } }).then((res) => {
        langs.value = res.data.map((el) => {
            return { id: el.id, name: el.name };
        });
    });
}
getLansList();
</script>

<template>
    <div>
        <!--        <TheBreadcrumb />-->
        <div class="card w-full">
            <FormBuilder isCreate grid-class="grid grid-cols-1 w-full" v-bind="{ isSubmit, isUpdate, updateValue, feilds, hideTitle }" @handel-submit-form="handleSubmitFrom" :methods="[, , , , , , , , updateEditor]"> </FormBuilder>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
