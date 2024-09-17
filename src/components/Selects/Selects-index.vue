<script setup>
import Select from 'primevue/select';
import { ref, toRef, watch } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { camelize } from '@/utils';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const props = defineProps({
    filterName: {
        type: String,
        required: true,
        default: () => 'name'
    },
    placeholder:{
        type: String,
        required: false
    },
    modelValue: {
        type: [String],
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
let items = ref([]);
const page = ref(1);
const loading = ref(false);
const search = ref(undefined);
const selected = ref();
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
    _items = [];
    getOptions({ filters });

    console.log(filters.value);
};
const checkDublicat = async (arr) => {
    let set=new Set([_items[0]?.id]);
    let arrary = []
    arr.forEach(el => {
        if(!set.has(el.id)) arrary.push(el)
    })

    return await arrary
}
searchFilter = debounce(searchFilter, 1500);
async function getOptions(params) {
    await store.dispatch(`${camelize(`get ${props.actionName}`)}`,{ ...params, pagination: { page: page.value, pageSize } })
        .then(async (res) => {
            const { data, meta } = res;
            const itemCheck = await checkDublicat(data)
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
    emit('update:modelValue', value);
    selected.value = value;
}
const {modelValue} = toRef(props)
watch(
    () =>modelValue?.value,
    (newvalue) => {
        if (typeof newvalue === 'object') {
            const checkIncludes = items.value.filter((el) => el.id === newvalue.id);
            if (!checkIncludes.length) {
                items.value.push(newvalue);
                _items.push(newvalue)
                selected.value = newvalue.id;
            }
        }
    }
);
watch(()=> props.actionName ,() => {
     items.value =[]
    _items.value =[]
    page.value =1;
})
</script>

<template>
    <div class="flex justify-center">
        <Select
            v-model="selected"
            :options="items"
            @filter="searchFilter"
            @before-show="beforeShow"
            :optionLabel="'name'"
            class="w-full"
            :invalid="invalid"
            @update:modelValue="handleSelected"
            optionValue="id"
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
