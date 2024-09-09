<script setup>
import { useStore } from 'vuex';

import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import { onMounted, ref, watch } from 'vue';
import Uzbmap from '@/components/UZmap/uzbmap.vue';
import { useI18n } from 'vue-i18n';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const store = useStore();
 const {t} = useI18n()
const products = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);
const analiticList = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);
store.dispatch('getAnalytics').then((items) => {
    analiticList.value = [
        {
            icon: 'mdi-home-account',
            avatarColor: 'success',
            slug: 'getting-started',
            title: t('regions'),
            count: items.regions
        },
        {
            icon: 'mdi-home-export-outline',
            avatarColor: 'success',
            slug: 'getting-started',
            title: t('districts'),
            count: items.districts
        },
        {
            icon: 'mdi-home-assistant',
            avatarColor: 'success',
            slug: 'getting-started',
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
            icon: 'mdi-account-cowboy-hat-outline',
            slug: 'safety-security',
            avatarColor: 'primary',
            title: t('farmers'),
            count: items.farmers
        },
        {
            slug: 'chats',
            title: t('fields'),
            avatarColor: 'warning',
            count: items.fields,
            icon: 'mdi-hexagon-outline'
        },
        {
            avatarColor: 'error',
            icon: 'mdi-map-marker-distance',
            slug: 'rules-place',
            title: t('allFieldsArea'),
            count: items.allFieldsArea
        },

        {
            icon: 'mdi-comment-account-outline',
            slug: 'safety-security',
            avatarColor: 'primary',
            title: t('consultations'),
            count: items.consultations
        },
        {
            icon: 'mdi-account-group',
            slug: 'safety-security',
            avatarColor: 'primary',
            title: t('areaManagers'),
            count: items.areaManagers
        },
        {
            icon: 'mdi-beekeeper',
            slug: 'safety-security',
            avatarColor: 'primary',
            title: t('agronomists'),
            count: items.agronomists
        },

        {
            slug: 'chats',
            title: t('diseases'),
            avatarColor: 'warning',
            count: items.diseases,
            icon: 'mdi-biohazard'
        },
        {
            slug: 'chats',
            title: t('plants'),
            avatarColor: 'warning',
            count: items.crops,
            icon: 'mdi-leaf'
        },
        {
            slug: 'chats',
            title: t('pests'),
            avatarColor: 'primary',
            count: items.pests,
            icon: 'mdi-bug'
        },
        {
            slug: 'chats',
            title: t('treatments'),
            avatarColor: 'primary',
            count: items.treatments,
            icon: 'mdi-hospital-box-outline'
        },
        {
            slug: 'chats',
            title: t('drugs'),
            avatarColor: 'primary',
            count: items.drugs,
            icon: 'mdi-pill'
        }
    ];
});
onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    // getLogin()
});

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Subscriptions',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: [4000, 10000, 15000, 4000],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Advertising',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                data: [2100, 8400, 2400, 7500],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Affiliate',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: [4100, 5200, 3400, 7400],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                borderSkipped: true,
                barThickness: 32
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" v-for="(item,index) in analiticList" :key="index">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="text-blue-500 !text-xl" :class="[item.icon]"></i>
                    </div>
                    <div>
                        <span class="block text-muted-color font-medium mb-4">{{item.title}}</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{item.count}}</div>
                    </div>

                </div>
<!--                <span class="text-primary font-medium">24 new </span>-->
<!--                <span class="text-muted-color">since last visit</span>-->
            </div>
        </div>
<!--        <div class="col-span-12 lg:col-span-6 xl:col-span-3">-->
<!--            <div class="card mb-0">-->
<!--                <div class="flex justify-between mb-4">-->
<!--                    <div>-->
<!--                        <span class="block text-muted-color font-medium mb-4">Revenue</span>-->
<!--                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>-->
<!--                    </div>-->
<!--                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">-->
<!--                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <span class="text-primary font-medium">%52+ </span>-->
<!--                <span class="text-muted-color">since last week</span>-->
<!--            </div>-->
<!--        </div>-->

<!--        <div class="col-span-12 lg:col-span-6 xl:col-span-3">-->
<!--            <div class="card mb-0">-->
<!--                <div class="flex justify-between mb-4">-->
<!--                    <div>-->
<!--                        <span class="block text-muted-color font-medium mb-4">Customers</span>-->
<!--                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>-->
<!--                    </div>-->
<!--                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">-->
<!--                        <i class="pi pi-users text-cyan-500 !text-xl"></i>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <span class="text-primary font-medium">520 </span>-->
<!--                <span class="text-muted-color">newly registered</span>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="col-span-12 lg:col-span-6 xl:col-span-3">-->
<!--            <div class="card mb-0">-->
<!--                <div class="flex justify-between mb-4">-->
<!--                    <div>-->
<!--                        <span class="block text-muted-color font-medium mb-4">Comments</span>-->
<!--                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>-->
<!--                    </div>-->
<!--                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">-->
<!--                        <i class="pi pi-comment text-purple-500 !text-xl"></i>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <span class="text-primary font-medium">85 </span>-->
<!--                <span class="text-muted-color">responded</span>-->
<!--            </div>-->
<!--        </div>-->

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <Uzbmap />
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="flex justify-between items-center mb-6">
                    <div class="font-semibold text-xl">Best Selling Products</div>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                        <Menu ref="menu2" :popup="true" :model="items" class="!min-w-40"></Menu>
                    </div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                            <div class="mt-1 text-muted-color">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-orange-500 h-full" style="width: 50%"></div>
                            </div>
                            <span class="text-orange-500 ml-4 font-medium">%50</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                            </div>
                            <span class="text-cyan-500 ml-4 font-medium">%16</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-4 font-medium">%67</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                            <div class="mt-1 text-muted-color">Office</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-green-500 h-full" style="width: 35%"></div>
                            </div>
                            <span class="text-primary ml-4 font-medium">%35</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-4 font-medium">%75</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                            <div class="mt-1 text-muted-color">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-teal-500 h-full" style="width: 40%"></div>
                            </div>
                            <span class="text-teal-500 ml-4 font-medium">%40</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
