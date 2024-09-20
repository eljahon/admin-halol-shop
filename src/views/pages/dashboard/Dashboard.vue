<script setup>
import { useStore } from 'vuex';

import { useLayout } from '@/layout/composables/layout';
import {onMounted, ref } from 'vue';
import Uzbmap from '@/components/UZmap/uzbmap.vue';
import { useI18n } from 'vue-i18n';
import { Viloyat, Tumalar, Hudud, Farmers, Maydon, allLand, consultand, areaManger, agranom, kasalik, Osimliklar, Zarar, kassaliklar, dori } from '@/assets/svg';
import { useRoute, useRouter } from 'vue-router';
import { actions } from '@/utils/Store_Schema';
const { getRegionStatistics } = actions(['regionStatistics'], { get: true });
const { getPrimary, getSurface, isDarkTheme } = useLayout();
const store = useStore();
const { t } = useI18n();
const analiticList = ref(null);
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isDisdtirct = ref(route.query.district ?? false);
const reagions = ref();
const allPlice = ref(0);
const districtName = ref(undefined);
const isRegion = ref(false);
const id = ref(route.query?.id ?? undefined);
function getDashboard() {
    isLoading.value = true;
    store
        .dispatch('getAnalytics')
        .then((items) => {
            isLoading.value = false;
            analiticList.value = [
                {
                    icon: 'pi pi-image',
                    avatarColor: 'success',
                    slug: Viloyat,
                    title: t('regions'),
                    count: items.regions
                },
                {
                    icon: 'pi pi-clipboard',
                    avatarColor: 'success',
                    slug: Tumalar,
                    title: t('districts'),
                    count: items.districts
                },
                {
                    icon: 'mdi-home-assistant',
                    avatarColor: 'success',
                    slug: Hudud,
                    title: t('areas'),
                    count: items.areas
                },
                // {
                //   slug: 'orders',
                //   title: 'Orders',
                //   avatarColor: 'info',
                //   icon: 'mdi-cube-outline',
                //   count: 43

                // },
                {
                    icon: 'pi pi-users',
                    slug: Farmers,
                    avatarColor: 'primary',
                    title: t('farmers'),
                    count: items.farmers
                },
                {
                    slug: Maydon,
                    title: t('fields'),
                    avatarColor: 'warning',
                    count: items.fields,
                    icon: 'pi pi-spin pi-stop-circle'
                },
                {
                    avatarColor: 'error',
                    icon: 'pi pi-spin pi-stop-circle',
                    slug: allLand,
                    title: t('allFieldsArea'),
                    count: (items.allFieldsArea/10000).toFixed(2)
                },

                {
                    icon: 'pi pi-users',
                    slug: consultand,
                    avatarColor: 'primary',
                    title: t('consultations'),
                    count: items.consultations
                },
                {
                    icon: 'pi pi-users',
                    slug: areaManger,
                    // avatarColor: ,
                    title: t('areaManagers'),
                    count: items.areaManagers
                },
                {
                    icon: 'pi pi-user',
                    slug: agranom,
                    avatarColor: 'primary',
                    title: t('agronomists'),
                    count: items.agronomists
                },

                {
                    slug: kasalik,
                    title: t('diseases'),
                    // avatarColor: ,
                    count: items.diseases,
                    icon: 'mdi-biohazard'
                },
                {
                    slug: Osimliklar,
                    title: t('plants'),
                    avatarColor: 'warning',
                    count: items.crops,
                    icon: 'mdi-leaf'
                },
                {
                    slug: Zarar,
                    title: t('pests'),
                    avatarColor: 'primary',
                    count: items.pests,
                    icon: 'mdi-bug'
                },
                {
                    slug: kassaliklar,
                    title: t('treatments'),
                    avatarColor: 'primary',
                    count: items.treatments,
                    icon: 'mdi-hospital-box-outline'
                },
                {
                    slug: dori,
                    title: t('drugs'),
                    avatarColor: 'primary',
                    count: items.drugs,
                    icon: 'mdi-pill'
                }
            ];
        })
        .catch((err) => {
            isLoading.value = false;
        });
}
function getRegionStatick() {
    isRegion.value = true;
    const _query={...route.query}
  return getRegionStatistics({ region: 12, ..._query })
        .then((res) => {
            reagions.value = res.data;
            allPlice.value = res.data.reduce((acc,el) =>acc+el.amount ,0)
            isRegion.value = false;
        })
        .catch((err) => {
            isRegion.value = false;
        });
}

getDashboard();
getRegionStatick();
async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    await await getRegionStatick()
}
async function handelItem(item) {
    id.value = item.id;
    districtName.value = item;
    routerPush({region: item.id})

}
async function handleClick(item) {
    // districtName.value = item
    isDisdtirct.value = true
    await routerPush({district: item.id})
}
async function handleDistrict () {
    isDisdtirct.value = false;
    await routerPush({district: undefined})
}
function  handleScroll (event) {
    console.log(event);
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    // Quyidagi holatda scroll oxiriga yetganini tekshirish
    if (scrollTop + clientHeight >= scrollHeight) {
        console.log('Scroll bottom reached');
    } else {
        console.log('Current scroll position:', scrollTop);
    }
}
onMounted(()=> {
    setTimeout(() =>{
        const scroll = document.getElementById('scroll');
        scroll?.addEventListener('scroll', handleScroll)
    }, 0)

})
</script>

<template>
    <div>
        <div class="grid grid-cols-12 gap-4">
            <template v-for="item in 15" :key="item" v-if="isLoading">
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <Skeleton width="100%" height="7rem" />
                </div>
            </template>
            <template v-else>
                <div class="col-span-12 lg:col-span-6 xl:col-span-3" v-for="(item, index) in analiticList" :key="index">
                    <div class="bg-white dark:bg-blue-400/10 p-4 rounded mb-0">
                        <div class="flex justify-between mb-4">
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded" style="width: 2rem; height: 2rem">
                                <img width="25" height="25" :src="item.slug" alt="" />
                            </div>
                            <div>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ item.count }}</div>

                                <span class="block font-medium mb-4 dark:text-white text-primary">{{ item.title }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="grid grid-cols-12 gap-4 mt-8">
            <div class="col-span-12 xl:col-span-8">
                <div class="card">
                    <span>{{ $t('region') }}: {{ districtName?.name }}</span>
                    <div class="mt-4">
                        <Uzbmap @handelItem="handelItem" :id="id" />
                    </div>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-4">
                <div class="card overflow-hidden">
                    <div class="flex justify-between items-center">{{ isDisdtirct ? $t('areas') :$t('districts') }} <i v-if="isDisdtirct" class="pi pi-arrow-left text-primary cursor-pointer" @click="handleDistrict"></i></div>
                    <span class="text-primary">{{(allPlice/10000)?.toFixed(2)}}:{{$t('hectare')}}</span>
                    <div v-if="!isRegion" class="overflow-y-auto mt-2 p-2 h-full" style="max-height: 400px" id="scroll">
                        <section class="flex gap-4 mt-2 items-center dark:bg-blue-400/10 p-4 rounded shadow-custom max-h-2xl cursor-pointer" v-for="(item, index) in reagions" :key="index" @click="isDisdtirct? ()=>{} :handleClick(item)">
                            <span class="">
                                <img :src="Hudud" alt="Hudud image" />
                            </span>
                            <span class="dark:text-white text-primary">{{ item.name }}</span>
                        </section>
                    </div>
                    <section v-else class="flex gap-4 mt-2 items-center dark:bg-blue-400/10 rounded" v-for="item in 8" :key="item">
                        <Skeleton width="100%" height="4rem" />
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
