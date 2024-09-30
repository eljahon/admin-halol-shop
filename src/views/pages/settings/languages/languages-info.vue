<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { debounce } from 'lodash';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import LangItemForm from '@/components/Dialog-Forms/Lang-Item-Form.vue';
const { getLangs, putLangItems, getLangItems } = actions(['langItems', 'langs'], { get: true, getById: true, post: true, put: true });
const router = useRouter();
const route = useRoute();
const toast = useToast();
const langItems = ref();
const updateValue = ref();
const langs = ref();
const openForm = ref(false);
const isHash = ref({});
let isLoading = ref(false);
const { t } = useI18n();
const filters = ref({
    value: route.query?.value ?? undefined,
    key: route.query?.key ?? undefined
});
async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    await getLangItemsList();
}

function getLangsList() {
    getLangs().then((res) => {
        console.log(res);
        langs.value = res.data;
    });
}
function getLangItemsList() {
    const filters = { lang: { id: route.query?.id ?? undefined }, key: { $containsi: route.query?.key ?? undefined }, value: { $containsi: route.query?.value ?? undefined } };
    const pagination = { page: 1, pageSize: 9999 };
    const sort = { key: 'asc' };
    isLoading.value = true;
    getLangItems({ filters, pagination, sort })
        .then((res) => {
            langItems.value = res.data;
            isLoading.value = false;
        })
        .catch(() => {
            isLoading.value = false;
        });
}

let onSearchKey = debounce(function (value) {
    routerPush({ key: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500);
let onSearchValue = debounce(function (value) {
    routerPush({ value: value.target?.value ? value.target?.value : undefined, page: 1 });
}, 1500);
function openNew() {
    openForm.value = true;
}
function itemEdit(item) {
    isHash.value ={}
    isHash.value[item.id] = {id: item.id, key: item.key, value: item.value, isOpen: true};
}
function itemEditSend(item) {
    putLangItems({ id: item.id, data: { value: isHash.value[item.id].value } }).then((res) => {
        toast.add({ severity: 'success', summary: t('lang-item'), detail: t('lang-item-update'), life: 3000 });
        getLangItemsList();
    });
}
function copyText(item) {
    navigator.clipboard
        .writeText(isHash.value[item.id].key)
        .then(function () {
            toast.add({ severity: 'success', summary: 'Copy', detail: 'text copy successfully', life: 3000 });
        })
        .catch(function (error) {});
}
getLangsList();
getLangItemsList();
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card flex justify-between">
            <div class="flex gap-3">
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters.key" :placeholder="$t('key') + ' ' + $t('search')" @input="onSearchKey" />
                </IconField>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters.value" :placeholder="$t('value') + ' ' + $t('search')" @input="onSearchValue" />
                </IconField>
            </div>
            <div>
                <Button v-if="route.query.locale === 'uz'" label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
            </div>
        </div>
        <Dialog v-model:visible="openForm" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('lang-create') }}</h1>
            </template>
            <div class="w-full">
                <LangItemForm
                    @cloesModal="
                        () => {
                            openForm = false;
                            getLangItemsList();
                        }
                    "
                    :hideTitle="false"
                    :updateValue="updateValue"
                />
            </div>
        </Dialog>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <template v-if="!isLoading">
                <div class="" v-for="(item, index) in langItems" :key="index">
                    <div class="bg-white dark:bg-blue-400/10 p-4 rounded p-2">
                        <span
                            ><b>{{ $t('key') }}</b
                            >: {{ item.key }}</span
                        >
                        <button class="cursor-pointer" @click="copyText(item)"><i class="pi pi-copy"></i></button>
                        <br />
                        <hr class="my-2" />
                        <div v-if="!isHash.hasOwnProperty(item.id)" class="flex gap-2">
                            <b>{{ $t('value') }}</b
                            >: {{ item.value }}
                            <button @click="itemEdit(item)" class="text-primary cursor-pointer"><i class="pi pi-pencil"></i></button>
                        </div>
                        <div v-else class="flex gap-4">
                            <InputText v-model="isHash[item.id].value" />
                            <button @click="itemEditSend(item)" class="text-primary cursor-pointer"><i class="pi pi-check"></i></button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="" v-for="(item, index) in 30" :key="index">
                    <div class="bg-white dark:bg-blue-400/10 p-4 rounded">
                        <Skeleton width="100%" height="3rem" />
                        <hr class="my-2" />
                        <Skeleton width="100%" height="3rem" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
