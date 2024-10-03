<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', roles: ['admin'] }]
    },
    {
        items: [
            // { label: 'land_monitoring', icon: 'pi pi-spin pi-stop-circle', to: '/land-monitoring', roles: ['admin'] },
            // { label: 'tasks', icon: 'pi pi-fw pi-file-word', to: '/tasks', class: 'rotated-icon',roles:['admin'] },
            // { label: 'crops', icon: 'pi pi-fw pi-list', to: '/crops', roles: ['admin'] },
            { label: 'products', icon: 'pi pi-fw pi-table', to: '/products', roles: ['admin'], name: 'products' },
            { label: 'companies', icon: 'pi pi-fw pi-list', to: '/companies', roles: ['admin'],name:'companies' },
            { label: 'categories', icon: 'pi pi-fw pi-list', to: '/categories', roles: ['admin'],name:'categories' },
            { label: 'banners', icon: 'pi pi-fw pi-list', to: '/banners', roles: ['admin'],name:'banners' },
            { label: 'users', icon: 'pi pi-fw pi-users', to: '/users', roles: ['superadmin'], name: 'users' }
        ]
    },
    // {
    //     items: [
    //         {
    //             label: 'user',
    //             icon: 'pi pi-fw pi-users',
    //             items: [
    //                 {
    //                     label: 'farmers',
    //                     icon: 'pi pi-fw pi-users',
    //                     to: '/farmers',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'area_managers',
    //                     icon: 'pi pi-fw pi-users',
    //                     to: '/area-managers',
    //                     roles: ['admin']
    //                 },
    //                 // {
    //                 //     label: 'user',
    //                 //     icon: 'pi pi-fw pi-users',
    //                 //     to: '/user',
    //                 //     roles: ['admin']
    //                 // },
    //                 {
    //                     label: 'user',
    //                     icon: 'pi pi-fw pi-users',
    //                     to: '/users',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'distributors',
    //                     icon: 'pi pi-fw pi-users',
    //                     to: '/distributors',
    //                     roles: ['admin']
    //                 },
    //                 // {
    //                 //     label: 'activity_types',
    //                 //     icon: 'pi pi-fw pi-sign-in',
    //                 //     to: '/activitytypes'
    //                 // },
    //                 {
    //                     label: 'employee_roles',
    //                     icon: 'pi pi-fw pi-key',
    //                     to: '/employee-role',
    //                     roles: ['admin']
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'management',
    //             icon: 'pi pi-sliders-h',
    //             items: [
    //                 {
    //                     label: 'activity_types',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/activitytypes',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'companies',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/companies',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'treatments',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/treatments',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'fertilizations',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/fertilizations'
    //                 },
    //                 {
    //                     label: 'crop_category',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/cropsCategory',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'diseases',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/diseases',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'disease_category',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/diseaseCategories',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'districts',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/districts',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'areas',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/areas',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'drugs',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/drugs',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'drug_categories',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/drugCategories',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'plantings',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/plantings',
    //                     roles: ['admin']
    //                 },

    //                 // {
    //                 //     label: 'crops',
    //                 //     icon: 'pi pi-fw pi-times-circle',
    //                 //     to: '/crops'
    //                 // },
    //                 {
    //                     label: 'fertilizers',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/fertilizers',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'fertilizer_categories',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'fertilizerCategories',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'questions',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'questions',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'regions',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'regions',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'seasons',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'seasons',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'units',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'units',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'usefull_infos',
    //                     icon: 'pi pi-info-circle',
    //                     to: 'usefullinfos',
    //                     roles: ['admin']
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'website-settings',
    //             icon: 'pi pi-fw pi-box',
    //             items: [
    //                 {
    //                     label: 'news',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/news',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'reels',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/reels',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'landing',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/landing',
    //                     roles: ['admin']
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'settings',
    //             icon: 'pi pi-spin pi-cog',
    //             items: [
    //                 {
    //                     label: 'languages',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/languages',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'main_info',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/main-info',
    //                     roles: ['admin']
    //                 },
    //                 {
    //                     label: 'about_us',
    //                     icon: 'pi pi-info-circle',
    //                     to: '/about-us',
    //                     roles: ['admin']
    //                 }
    //             ]
    //         }
    //     ]
    // }
]);
// function checkRole(arr) {
//     const userRole = localStorage.getItem('role');
//     return arr.filter((item) => {
//         const hasAccess = item.roles ? item.roles.includes(userRole) : true;
//         if (item.items) {
//             item.items = checkRole(item.items);
//         }
//         return hasAccess;
//     });
// }
// const filteredModel = model.value
//     .map((group) => {
//         return {
//             ...group,
//             items: checkRole(group.items)
//         };
//     }).filter((el,index) => {
//         const hashRole = el.items.length && el.items[0].roles?.length;
//         if(hashRole) return el;
//         const hasItems = el?.items.length&&!el.items[index].roles?.length&&el?.items[index]?.items?.length;
//         // console.log(el,'element');
//       return hasItems;
//     })
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
