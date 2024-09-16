<script setup>
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import Password from 'primevue/password'
import InputNumber from 'primevue/inputnumber';
import CustomSelect from '@/components/Selects/Selects-index.vue'
import { useForm } from 'vee-validate';
import { computed, ref, toRefs, watch } from 'vue';
import * as yup from 'yup';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { boolean, string } from 'yup';
const { t } = useI18n();
const props = defineProps({
    isCreate:{
        type: Boolean,
        required: false
    },
    feilds: {
        type: Array,
        required: true,
        default: () => []
    },
    hideTitle:{
        type: Boolean,
        required:false,
        default: ()=> true
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
const dynamicSchema = yup.mixed().test(
    'is-string-or-object',
    "Bu qiymat string yoki object yoki number bo'lishi kerak",
    value => typeof value === 'string' || typeof value === 'object'||typeof value === 'number'
);
const vlist ={
    'string': yup.string(),
    'number': yup.number(),
    'date': yup.date(),
    'phone': phone,
    'object': yup.object(),
    'email': yup.string().email("Noto'g'ri email manzili").required('email manzlilini kiriting'),
    'StringOrObject': dynamicSchema
}
const validationList = (name) => vlist[name]
const route = useRoute();
const id = route.params.id;
const { handleSubmit, defineField, resetForm, errors, values, isSubmitting, setValues } = useForm({
    validationSchema: yup.object(
        props.feilds.reduce((acc, el) => {
            acc[el.label] = el.schema?.required ? validationList(el.schema.type).required(t(`${el.label}`) + ' ' + t('required-fild')) : '';
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
    CustomSelect,
    Textarea,
    ToggleSwitch,
    Password,
    InputNumber
};
const handleSubmitForm = handleSubmit(async (value) => {
    emit('handelSubmitForm', id === 'new' ? { data: value } : { id, data: value });
});
const {updateValue} =toRefs(props)
const inlineFeilds = computed(()=> props.feilds)
watch(() => updateValue.value,
    (values) => {
       setValues(values)
    }
);
</script>

<template>
    <div>
        <h1 v-if="hideTitle" class="font-bold text-2xl mb-3">{{ $t(`${route.name.split('-')[0].toLowerCase()}`) }} {{ id === 'new' ? $t('create') : $t('update') }}</h1>
        <div class="my-3 gap-4" :class="[gridClass]">
            <div v-for="(item, index) in inlineFeilds" :key="index" :class="[itemClass]">
                <Skeleton height="3rem" v-if="isUpdate" />
                <div v-else>
                    <div :class="[item.prop.class]">
                        <label class="block my-1">{{ $t(`${item.label}`) }}</label>
                        <component :invalid="!!errors[item.label]" class="w-full" v-bind="item.prop" :is="componentList[item.renderElement]" v-model="defineFieldForm[index][0].value" @update:modelValue="methods[index]" :modelValue="values[item.label]" :placeholder="$t(`${item.label}`)">
                        </component>
                    </div>
                    <small class="text-red-500 block">
                        {{ errors[item.label] }}
                    </small>
                </div>
            </div>


        </div>
        <div>
            <slot class="my-4" v-bind="{ values, set: setFieldValue }"></slot>
        </div>

        <div class="mt-5 flex gap-4 justify-end w-full">
            <Button severity="secondary" class="w-1/2" @click="resetForm" :label="$t('reset')"/>
            <Button class="w-1/2" :loading="isSubmit" :disabled="isSubmit" @click="handleSubmitForm" type="button" :label="(id === 'new'|| isCreate) ? $t('create') : $t('update')"/>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>


