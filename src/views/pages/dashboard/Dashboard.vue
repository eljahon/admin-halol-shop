<script setup>
import { useStore } from 'vuex';

import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import { onMounted, ref, watch } from 'vue';
import Uzbmap from '@/components/UZmap/uzbmap.vue';
import { useI18n } from 'vue-i18n';
import { Viloyat, Tumalar, Hudud, Farmers, Maydon, allLand, consultand, areaManger, agranom, kasalik, Osimliklar, Zarar, kassaliklar, dori } from '@/assets/svg';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const store = useStore();
const { t } = useI18n();
const analiticList = ref(null);
const isLoading = ref(false);

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
                    count: items.allFieldsArea
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
getDashboard();
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
                    <div class="bg-white dark:bg-blue-400/10 p-3 rounded mb-0">
                        <div class="flex justify-between mb-4">
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 1.5rem; height: 1.5rem">
                                <!--                        <i class="text-blue-500 !text-xl" :class="[item.icon]"></i>-->
                                <img width="20" height="20" :src="item.slug" alt="" />
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
                    <span>{{$t('region')}}: {{'Buhoro'}}</span>
                    <div class="mt-4">
                        <Uzbmap @handelItem="handelItem"/>
                    </div>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-4">
                <div class="card">

                    <h1>{{$t('region')}}</h1>
                </div>
            </div>
        </div>
    </div>
</template>
