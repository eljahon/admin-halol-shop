<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        // label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        // label: 'UI Components',
        items: [
            // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'land_monitoring', icon: 'pi pi-spin pi-stop-circle', to: '/land-monitoring' },
            { label: 'tasks', icon: 'pi pi-fw pi-file-word', to: '/uikit/button', class: 'rotated-icon' },
            { label: 'products', icon: 'pi pi-fw pi-table', to: '/products' },
            { label: 'chat_statictik', icon: 'pi pi-fw pi-send', to: '/chat-statictik' },
            { label: 'crops', icon: 'pi pi-fw pi-list', to: '/crops' }
            // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
            // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
            // { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        ]
    },
    {
        // label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            // {
            //     label: 'Landing',
            //     icon: 'pi pi-fw pi-globe',
            //     to: '/landing'
            // },
            {
                label: 'user',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'farmers',
                        icon: 'pi pi-fw pi-lock',
                        to: '/farmers'
                    },
                    {
                        label: 'area_managers',
                        icon: 'pi pi-fw pi-id-card',
                        to: '/area-managers'
                    },
                    {
                        label: 'user',
                        icon: 'pi pi-fw pi-lock',
                        to: '/user'
                    },
                    {
                        label: 'employees',
                        icon: 'pi pi-fw pi-lock',
                        to: '/employees'
                    },
                    {
                        label: 'distributors',
                        icon: 'pi pi-fw pi-lock',
                        to: '/distributors'
                    },
                    // {
                    //     label: 'activity_types',
                    //     icon: 'pi pi-fw pi-sign-in',
                    //     to: '/activitytypes'
                    // },
                    {
                        label: 'employee_roles',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/employee-role'
                    }
                ]
            },
            {
                label: 'management',
                icon: 'pi pi-sliders-h',
                items: [
                    {
                        label: 'activity_types',
                        icon: 'pi  pi-circle',
                        to: '/activitytypes'
                    },
                    {
                        label: 'companies',
                        icon: 'pi pi-circle',
                        to: '/companies'
                    },
                    {
                        label: 'treatments',
                        icon: 'pi pi-circle',
                        to: '/treatments'
                    },
                    {
                        label: 'fertilizations',
                        icon: 'pi pi-circle',
                        to: '/fertilizations'
                    },
                    {
                        label: 'cropsCategory',
                        icon: 'pi pi-circle',
                        to: '/cropsCategory'
                    },
                    {
                        label: 'diseases',
                        icon: 'pi pi-circle',
                        to: '/diseases'
                    },
                    {
                        label: 'diseaseCategory',
                        icon: 'pi pi-circle',
                        to: '/diseaseCategories'
                    },
                    {
                        label: 'districts',
                        icon: 'pi pi-circle',
                        to: '/districts'
                    },
                    {
                        label: 'areas',
                        icon: 'pi pi-circle',
                        to: '/areas'
                    },
                    {
                        label: 'drugs',
                        icon: 'pi pi-circle',
                        to: '/drugs'
                    },
                    {
                        label: 'drugCategories',
                        icon: 'pi pi-circle',
                        to: '/drugCategories'
                    },
                    {
                        label: 'plantings',
                        icon: 'pi pi-circle',
                        to: '/plantings'
                    },

                    // {
                    //     label: 'crops',
                    //     icon: 'pi pi-fw pi-times-circle',
                    //     to: '/crops'
                    // },
                    {
                        label: 'fertilizers',
                        icon: 'pi pi-circle',
                        to: '/fertilizers'
                    },
                    {
                        label: 'fertilizerCategories',
                        icon: 'pi pi-circle',
                        to: 'fertilizerCategories'
                    },
                    {
                        label: 'questions',
                        icon: 'pi pi-circle',
                        to: 'questions'
                    },
                    {
                        label: 'regions',
                        icon: 'pi pi-circle',
                        to: 'regions'
                    },
                    {
                        label: 'seasons',
                        icon: 'pi pi-circle',
                        to: 'seasons'
                    },
                    {
                        label: 'units',
                        icon: 'pi pi-circle',
                        to: 'units'
                    },
                    {
                        label: 'usefullinfos',
                        icon: 'pi pi-circle',
                        to: 'usefullinfos'
                    }
                ]
            },
            {
                label: 'website-settings',
                icon: 'pi pi-fw pi-box',
                items: [
                    {
                        label: 'activity_types',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/activitytypes'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/Auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/Auth/access'
                    }
                ]
            },
            {
                label: 'settings',
                icon: 'pi pi-spin pi-cog',
                items: [
                    {
                        label: 'activity_types',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/activitytypes'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/Auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/Auth/access'
                    }
                ]
            }

            // {
            //     label: 'Crud',
            //     icon: 'pi pi-fw pi-pencil',
            //     to: '/pages/crud'
            // },
            // {
            //     label: 'Not Found',
            //     icon: 'pi pi-fw pi-exclamation-circle',
            //     to: '/pages/notfound'
            // },
            // {
            //     label: 'Empty',
            //     icon: 'pi pi-fw pi-circle-off',
            //     to: '/pages/empty'
            // }
        ]
    }
]);
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
