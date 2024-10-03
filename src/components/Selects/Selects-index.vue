<script setup>
import Select from 'primevue/select';
import { ref, toRef, watch } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { camelize } from '@/utils';
import { debounce } from 'lodash';
import { useStore } from 'vuex';
import { isFunction, unionBy } from 'lodash';
const props = defineProps({
    filterName: {
        type: String,
        required: true,
        default: () => 'name'
    },
    getKey: {
        type: String,
        required: false,
        default: () => 'data'
    },
    initialValues:{
        type: Array,
        required: false,
        default: () => []
    },
    optionLabel:{
        type: String,
        required: false,
        default: () => 'name'
    },
    optionValue:{
        type: String,
        required: false,
        default: () => 'id'
    },
    customFilter:{
        type: Function,
        required: false,
        default: (value) => value
    },
    placeholder:{
        type: String,
        required: false
    },
    modelValue: {
        type: [String, Number],
        required: false
    },
    actionName: {
        type: String,
        required: true
    },
    invalid:{
        type: [String, Boolean],
        required: false
    }
});
const store = useStore()
const emit = defineEmits(['update:modelValue']);
const {actionName}=toRef(props)
const action = actions([`${actionName}`], { get: true });
const pageSize = 25;
let items = ref(props.initialValues? [props.initialValues] :[]);
const page = ref(1);
const loading = ref(false);
const search = ref(undefined);
const selected = ref(props.modelValue ?? undefined);
let pages = {};
let _items = ref([]);

let searchFilter = function (event) {
    loading.value = true;
    const {
        target: { value }
    } = event;
    const filters = {
        [props.filterName]: { $containsi: value }
    };
    search.value = value;
    page.value = 1;
    _items.value = [];
    getOptions({ filters });

    console.log(filters.value);
};
searchFilter = debounce(searchFilter, 1500);
async function getOptions(params) {
    // console.log(props.customFilter(params), 'props.customFilter(params)');
    const _params = isFunction(props.customFilter) ? props.customFilter(params) : params;
    await store.dispatch(`${camelize(`get ${props.actionName}`)}`,{ ..._params})
        .then(async (res) => {
            const { data, meta } = res;
            const itemCheck = data[props.getKey];
            let _data = [..._items.value, ...itemCheck];
            itemCheck.forEach(el=> {_items.value.push(el)})
            items.value = _data;
            pages = meta;
            loading.value = false;
            return data;
        })
        .catch((err) => {
            loading.value = false;
            return err;
        });
}
async function beforeShow(event) {
    if (!items.value?.length || items.value?.length === 1) {
        loading.value = true;
        await getOptions();
    }
}
function scroll(event) {
    const isLastNol = event.last !== 0;
    const qol = event.last % pageSize === 0;
    const kat = event.last < pages?.total;
    if (isLastNol && qol && kat && page.value < pages?.pageCount) {
        page.value++;
        getOptions();
    }
}
function handleSelected(event) {
    console.log(event);
    const value = event;
    selected.value = value;
    const item = items.value.find(el=>el[props.optionValue] === value)
    console.log(item, 'item');
    emit('update:modelValue',{value, item});
    // selected.value = item;
}
const {modelValue} = toRef(props)
watch(
    () =>modelValue,
    (newvalue) => {
        console.log(newvalue, 'newvalue');
        selected.value = newvalue
        // if (typeof newvalue === 'object') {
        //     const checkIncludes = items.value.filter((el) => el.id === newvalue.id);
        //     if (!checkIncludes.length) {
        //         items.value.push(newvalue);
        //         _items.push(newvalue)
        //         selected.value = newvalue.id;
        //     }
        // }
    }
);
watch(()=> props.actionName ,() => {
     items.value =[]
    _items.value =[]
    page.value =1;
})
watch(()=> props.initialValues, (newvalue) => {
    console.log(newvalue, 'newvalue');
    // items.value = [...newvalue]
    // _items.value = [...newvalue]
})
</script>

<template>
    <div class="w-full">
        <Select
            v-model="selected"
            :options="items"
            @filter="searchFilter"
            @before-show="beforeShow"
            :optionLabel="optionLabel"
            variant="filled"
            class="w-full"
            checkmark
            :invalid="invalid"
            @update:modelValue="handleSelected"
            :optionValue="optionValue"
            showClear
            :placeholder="placeholder"
            :virtualScrollerOptions="{ lazy: true, showLoader: true, loading: loading, itemSize: 38, lazy: true, onLazyLoad: scroll }"

        >
            <template #header>
                <div class="p-2">
                    <IconField iconPosition="left">
                        <InputText class="w-full" v-model="search" @input="searchFilter" type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
            </template>
        </Select>
    </div>
</template>
