<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { useStore } from 'vuex';
import { actions } from '@/utils/Store_Schema';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Ymaps from '@/components/Ymaps/ymaps.vue';
import { Hudud } from '@/assets/svg';
const store = useStore();
const router = useRouter();
const route = useRoute();
let polygon = ref([]);
let zoom = ref(undefined);
let isLoading = ref(false);
const regions = ref(undefined);
const farmers = ref(undefined);
const region = ref(route.query.region ? +route.query.region : undefined);
const districts = ref(undefined);
const district = ref(route.query.district ? +route.query.district : undefined);
const areas = ref();
const area = ref(route.query.area ? +route.query.area : undefined);

const { getRegions, getDistricts, getAreas } = actions(['landMonitoring', 'regions', 'districts', 'areas'], { get: true, remove: true });

async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
}
async function getAreasList() {
    const _query = { ...route.query };
    return await getAreas({ populate: '*', filters: { district: _query.district ?? undefined } }).then((res) => {
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
    if (value) {
        await routerPush({ area: value, page: 1 });
    } else {
        await routerPush({ area: undefined, page: 1 });
    }
}
async function filterDistrict(value) {
    if (value) {
        await routerPush({ district: value, page: 1 });
        await getAreasList();
        await getLand();
    } else {
        await routerPush({ district: undefined, page: 1 });
        await getAreasList();
        await getLand();
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
async function getLand() {
    isLoading.value =true
    const _query = { ...route.query };
    return await store.dispatch('getLandMonitoring', _query).then((res) => {
        const { data, zoom, center } = res;
        let cor = [];
        farmers.value = res.data
        data.forEach((el) => {
            el.fields.forEach((e) => {
                cor.push({ ...e, fid: el.id });
            });
        });
        polygon.value = cor || [];
        // zoom.value = res.zoom;
        // if (res.center[1] && res.center[0]) center.value = [res.center[0],res.center[1]]
        isLoading.value=false
        return res;
    })
        .catch(err => {
            isLoading.value=false
        });
}
if (route.query.region && route.query.district) {
    getLand();
}
function handleClick(item) {
    router.push({name: 'farmers-info', query: {fid: item.id, region: item.region.id, district:item.district.id, area:item.area.id}})
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
                    </div>
                </div>
            </div>
            <div class="w-full grid grid-cols-12 gap-2">
                <div class="col-span-12 xl:col-span-9 lg:col-span-8">
                    <div class="maps-card h-[500px] overflow-hidden">
                        <Ymaps :poligons="polygon" :zoom="zoom" />
                    </div>

                </div>
                <div class="col-span-4 xl:col-span-3 ls:col-span-3">
                       <h1 class="text-center text-xl mt-2">{{$t('farmers')}}</h1>
                    <div class="overflow-y-auto mt-2 p-2" style="height: 500px" id="scroll">
                        <template v-if="!isLoading">
                            <section class="flex gap-4 mt-2 items-center dark:bg-blue-400/10 p-4 rounded shadow-custom max-h-2xl cursor-pointer" v-for="(item, index) in farmers" :key="index" @click="handleClick(item)">
                            <span class="">
                                <img :src="Hudud" alt="Hudud image" />
                            </span>
                                <span class="dark:text-white text-primary">{{ item?.fullname }}</span>
                            </section>
                        </template>
                        <template v-else>
                            <section class="flex gap-4 mt-2 items-center dark:bg-blue-400/10 rounded shadow-custom max-h-2xl cursor-pointer" v-for="(item, index) in 10" :key="index">
                                <Skeleton width="100%" height="4rem" />
                            </section>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
