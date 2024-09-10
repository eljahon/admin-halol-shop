<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { reactive, ref, watch } from 'vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useStore } from 'vuex';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import PaginatorCustom from '@/components/Paginator-Custom.vue';
import { useI18n } from 'vue-i18n';
import Ymaps from '@/components/ymaps/ymaps.vue';
const tabList = ref([
    {label: 'users', id: 0, key: 'users', icon: 'pi pi-users'},
    {label: 'consultants', id: 1, key: 'consultants', icon: 'pi pi-user-edit'},
])
const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
let polygon = ref([])
let center = ref([]);
let zoom = ref();
const regions = ref(undefined);
const region = ref(route.query.region ? +route.query.region : undefined);
const districts = ref(undefined);
const district = ref(route.query.district ? +route.query.district : undefined);
const areas = ref();
const area = ref(route.query.area ? +route.query.area : undefined);

const { getLandMonitoring, getRegions, getDistricts, getAreas } = actions(['landMonitoring', 'regions', 'districts', 'areas'], { get: true, remove: true });


async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
}
async function getAreasList() {
    const _query = { ...route.query };
    return await getAreas({populate: '*', filters:{district:_query.district ?? undefined}}).then((res) => {
        areas.value = res.data;
    });
}
async function getDistrictList() {
    const _query = { ...route.query };
    return await getDistricts({ populate: '*', filters: { region: { id: _query.region ?? undefined } } }).then((res) => {
        districts.value = res.data;
    });
}
async function getRegionsList() {
    const _query = { ...route.query };

    return await getRegions({ populate: '*' }).then((res) => {
        regions.value = res.data;
    });
}
getRegionsList();
getDistrictList();
getAreasList();
async function filterAreas(value) {
    if(value) {
        await routerPush({ area: value, page: 1 });
    } else {
        await routerPush({ area: undefined, page: 1 });
    }
}
async function filterDistrict(value) {
    if (value) {
        await routerPush({ district: value, page: 1 });
        await getAreasList();
       await getLand()
    } else {
        await routerPush({ district: undefined, page: 1 });
        await getAreasList();
        await getLand()
    }
}
async function filterRegion(value) {
    if (value) {
        await routerPush({ region: value, page: 1 });
        await getDistrictList();
    } else {
        await routerPush({ region: undefined, page: 1 });
        await getDistrictList();
    }
}
async function getLand () {
    const _query = {...route.query}
   return  await store.dispatch('getLandMonitoring',_query)
        .then(res => {
            const {data} =res;
            console.log(res);
            // if (res.center[1] && res.center[0]) center.value = [res.center[0],res.center[1]];

            let cor =[]
            data.forEach(el => {
                el.fields.forEach(e => {
                    cor.push({...e, fid:el.id})
                })
            });
            console.log(cor);
            polygon.value=cor||[]
            // zoom.value = res.zoom;
            // if (res.center[1] && res.center[0]) center.value = [res.center[0],res.center[1]]
            return res
        })
}
if(route.query.region&&route.query.district) {
    getLand()
}
</script>

<template>
    <div>
        <TheBreadcrumb />
        <div class="card">
            <div class="flex gap-2 justify-between">
                <div>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <Select class="w-full md:w-56" v-model="region" :placeholder="$t('region')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterRegion" :options="regions"> </Select>
                        <Select class="w-full md:w-56" v-model="district" :placeholder="$t('district')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterDistrict" :options="districts"> </Select>
                        <Select class="w-full md:w-56" v-model="area" :placeholder="$t('area')" optionLabel="name" optionValue="id" clearable showClear @update:modelValue="filterAreas" :options="areas"> </Select>
                        <!--                        <IconField>-->
                        <!--                            <InputIcon>-->
                        <!--                                <i class="pi pi-search" />-->
                        <!--                            </InputIcon>-->
                        <!--                            <InputText v-model="search" :placeholder="$t('search-by-name')" @input="onSearch" />-->
                        <!--                        </IconField>-->
                    </div>
                </div>

            </div>
            <div>
                <div class="maps-card">
                    <Ymaps :poligons="polygon"/>
                </div>
                <div class="info">

                </div>
            </div>

        </div>
    </div>
</template>
