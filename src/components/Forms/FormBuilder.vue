<script setup>
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import { useForm } from 'vee-validate';
import {ref, toRefs, watch } from 'vue';
import * as yup from 'yup';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { boolean, string } from 'yup';
const { t } = useI18n();
const props = defineProps({
    feilds: {
        type: Array,
        required: true,
        default: () => []
    },
    isUpdate: {
        type: boolean,
        required: true,
        default: () => false
    },
    isSubmit: {
        type: boolean,
        required: true,
        default: () => false
    },
    gridClass: {
        type: string,
        required: false,
        default: () => 'grid grid-cols-2'
    },
    itemClass: {
        type: string,
        required: false,
        default: () => ''
    },
    updateValue:{
        type: Object,
        required: false,
        default:() => {}
    },
    methods:{
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['handelSubmitForm']);
const phone = yup.string()
    .matches(/^\+998\d{9}$/, 'Telefon raqami +998 bilan boshlanib, 9 ta raqam bo\'lishi kerak')
    .required('Telefon raqami majburiy')
const vlist ={
    'string': yup.string(),
    'number': yup.number(),
    'date': yup.date(),
    'phone': phone
}
const validationList = (name) => vlist[name]
const route = useRoute();
const id = route.params.id;
const { handleSubmit, defineField, resetForm, errors, setFieldValue, values, isSubmitting } = useForm({
    validationSchema: yup.object(
        props.feilds.reduce((acc, el) => {
            acc[el.label] = el.schema.required ? validationList(el.schema.type).required(t(`${el.label}`) + ' ' + t('required-fild')) : '';
            return acc;
        }, {})
    ),
    initialValues: props.feilds.reduce((acc, el) => {
        acc[el.label] = el?.value ?? '';
        return acc;
    }, {})
});
const defineFieldForm = props.feilds.map((el) => defineField(el.label));
const componentList = {
    DatePicker,
    InputText,
    Select,
    Textarea,
    ToggleSwitch
};
const handleSubmitForm = handleSubmit(async (value) => {
    emit('handelSubmitForm', id === 'new' ? { data: value } : { id, data: value });
});
const {updateValue} =toRefs(props)
watch(() => updateValue.value,
    (values) => {
        props.feilds.forEach(el => {

            if(el.renderElement === 'Select') {
                // console.log('daslomsfsdfsdfds', values[el.label]?.id);
                setFieldValue(`${el.label}`,values[el.label]?.id)
            }

            setFieldValue(`${el.label}`,values[el.label])
        })
    }
);
</script>

<template>
    <div>
        <h1 class="font-bold text-2xl mb-3">{{ $t(`${route.name.split('-')[0].toLowerCase()}`) }} {{ id === 'new' ? $t('create') : $t('update') }}</h1>
        <div class="my-3 gap-4" :class="[gridClass]">
            <div v-for="(item, index) in feilds" :key="index" :class="[itemClass]">
                <Skeleton height="3rem" v-if="isUpdate" />
                <div v-else>
                    <div :class="[item.prop.class]">
                        <label class="block my-1">{{ $t(`${item.label}`) }}</label>
                        <component :invalid="!!errors[item.label]" class="w-full" v-bind="item.prop" :is="componentList[item.renderElement]" v-model="defineFieldForm[index][0].value" @update:modelValue="methods[index]" :type="item.prop?.type" :placeholder="$t(`${item.label}`)">
                        </component>
                    </div>
                    <small class="text-red-500 block">
                        {{ errors[item.label] }}
                    </small>
                </div>
            </div>
        </div>
        <slot v-bind="{ values, set: setFieldValue }"></slot>
        <div class="mt-5 flex gap-4 justify-end w-full">
            <Button severity="secondary" class="w-1/2" @click="resetForm" :label="$t('reset')"/>
            <Button class="w-1/2" :loading="isSubmit" :disabled="isSubmit" @click="handleSubmitForm" type="button" :label="id === 'new' ? $t('create') : $t('update')"/>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
