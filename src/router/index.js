import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// function  Gouard(from, to , next) {
//     console.log(from , to);
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('role');
//     const requiredRole = to.meta.role;
//     next();
// }
function guard(to, from, next) {
    try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        const requiredRole = to.meta.role;

        if (to.meta.requiresAuth) {
            if (!token) {
                return next({ name: 'AuthLogin' });
            } else if (requiredRole.includes(userRole)) {
                return next();
                // return next();
            } else {
                return next({ name: 'accessDenied' });
            }
        }
        next();
    } catch (err) {
        console.log(err);
        err;
        next();
    }
}
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/land-monitoring',
                    name: 'land_monitoring',
                    component: () => import('@/views/pages/land-monitoring/index.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/tasks',
                    name: 'tasks',
                    component: () => import('@/views/pages/tasks/index.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/main-info',
                    name: 'main_info',
                    component: () => import('@/views/pages/settings/main-info/index.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/chat-statictik',
                    name: 'chat_statictik',
                    component: () => import('@/views/pages/chat-statistik/chat-statistik-list.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('@/views/pages/chat/chat-list.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/crops',
                    name: 'crops',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'crops-list',
                            component: () => import('@/views/pages/crops/crops-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'crops-create',
                            component: () => import('@/views/pages/crops/crops-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'info',
                            name: 'crops-info',
                            component: () => import('@/views/pages/crops/crops-info.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/reels',
                    name: 'reels',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'reels-list',
                            component: () => import('@/views/pages/website-settings/reels/reels-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'reels-create',
                            component: () => import('@/views/pages/website-settings/reels/reels-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                        // {
                        //     path: 'info',
                        //     name: 'crops-info',
                        //     component: () => import('@/views/pages/crops/crops-Crop-Info.vue'),
                        //     meta: { requiresAuth: true, role: ['admin'] }
                        // }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/products',
                    name: 'products',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'products-list',
                            component: () => import('@/views/pages/product/products-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'products-create',
                            component: () => import('@/views/pages/product/products-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'info',
                            name: 'products-info',
                            component: () => import('@/views/pages/product/products-info.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/farmers',
                    name: 'farmers',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'farmers-list',
                            component: () => import('@/views/pages/users/farmers/farmers-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'farmers-create',
                            component: () => import('@/views/pages/users/farmers/farmers-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'info',
                            name: 'farmers-info',
                            component: () => import('@/views/pages/users/farmers/farmers-info.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'tasks',
                            name: 'farmers-tasks',
                            component: () => import('@/views/pages/users/farmers/farmers-tasks.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/area-managers',
                    name: 'area_managers',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'area_managers-list',
                            component: () => import('@/views/pages/users/farmers/farmers-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'area_managers-create',
                            component: () => import('@/views/pages/users/farmers/farmers-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/area-managers',
                    name: 'area_managers',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'area_managers-list',
                            component: () => import('@/views/pages/users/area-managers/area-managers-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'area_managers-create',
                            component: () => import('@/views/pages/users/area-managers/area-managers-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'user-list',
                            component: () => import('@/views/pages/users/users-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'user-create',
                            component: () => import('@/views/pages/users/users-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/employees',
                    name: 'employees',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'employees-list',
                            component: () => import('@/views/pages/users/employees/employees-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'employees-create',
                            component: () => import('@/views/pages/users/employees/employees-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/distributors',
                    name: 'distributors',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'distributors-list',
                            component: () => import('@/views/pages/users/distributors/distributors-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'distributors-create',
                            component: () => import('@/views/pages/users/distributors/distributors-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/employee-role',
                    name: 'employee_roles',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'employee_roles-list',
                            component: () => import('@/views/pages/users/employee-role/employee-role-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'employee_roles-create',
                            component: () => import('@/views/pages/users/employee-role/employee-role-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                        // {
                        //     path: 'info',
                        //     name: 'crops-info',
                        //     component: () => import('@/views/pages/crops/crops-Crop-Info.vue'),
                        //     meta: { requiresAuth: true, role: ['admin'] }
                        // }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/activitytypes',
                    name: 'activity_types',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'activity_types-list',
                            component: () => import('@/views/pages/management/activity-types/activity-types-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'activity_types-create',
                            component: () => import('@/views/pages/management/activity-types/activity-types-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                        // {
                        //     path: 'info',
                        //     name: 'activitytypes-info',
                        //     component: () => import('@/views/pages/crops/crops-Crop-Info.vue'),
                        //     meta: { requiresAuth: true, role: ['admin'] }
                        // }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/companies',
                    name: 'companies',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'companies-list',
                            component: () => import('@/views/pages/management/companies/companie-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                        // {
                        //     path: 'forms/:id',
                        //     name: 'activity_types-create',
                        //     component: () => import('@/views/pages/management/activity-types/activity-types-create.vue'),
                        //     meta: { requiresAuth: true, role: ['admin'] }
                        // },
                        // {
                        //     path: 'info',
                        //     name: 'activitytypes-info',
                        //     component: () => import('@/views/pages/crops/crops-Crop-Info.vue'),
                        //     meta: { requiresAuth: true, role: ['admin'] }
                        // }
                    ]
                    // meta: { requiresAuth: true, role: 'admin' }
                },
                {
                    path: '/treatments',
                    name: 'treatments',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'treatments-list',
                            component: () => import('@/views/pages/management/treatments/treatments-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'treatments-create',
                            component: () => import('@/views/pages/management/treatments/treatments-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/fertilizations',
                    name: 'fertilizations',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'fertilizations-list',
                            component: () => import('@/views/pages/management/fertilizations/fertilizations-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'fertilizations-create',
                            component: () => import('@/views/pages/management/fertilizations/fertilizations-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/cropsCategory',
                    name: 'crop_category',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'crop_category-list',
                            component: () => import('@/views/pages/management/crops-category/crops-category-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'crop_category-create',
                            component: () => import('@/views/pages/management/crops-category/crops-category-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/diseases',
                    name: 'diseases',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'diseases-list',
                            component: () => import('@/views/pages/management/diseases/diseases-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'diseases-create',
                            component: () => import('@/views/pages/management/diseases/diseases-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/diseaseCategories',
                    name: 'disease_category',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'disease_category-list',
                            component: () => import('@/views/pages/management/disease-categories/disease-categories-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'disease_category-create',
                            component: () => import('@/views/pages/management/disease-categories/disease-categories-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/districts',
                    name: 'districts',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'districts-list',
                            component: () => import('@/views/pages/management/districts/districts-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'districts-create',
                            component: () => import('@/views/pages/management/districts/districts-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/areas',
                    name: 'areas',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'areas-list',
                            component: () => import('@/views/pages/management/areas/areas-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'areas-create',
                            component: () => import('@/views/pages/management/areas/areas-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/drugs',
                    name: 'drugs',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'drugs-list',
                            component: () => import('@/views/pages/management/drugs/drugs-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'drugs-create',
                            component: () => import('@/views/pages/management/drugs/drugs-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/drugCategories',
                    name: 'drug_categories',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'drug_categories-list',
                            component: () => import('@/views/pages/management/drug-categories/drug-categories-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'drug_categories-create',
                            component: () => import('@/views/pages/management/drug-categories/drug-categories-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/plantings',
                    name: 'plantings',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'plantings-list',
                            component: () => import('@/views/pages/management/plantings/plantings-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'plantings-create',
                            component: () => import('@/views/pages/management/plantings/plantings-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/fertilizers',
                    name: 'fertilizers',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'fertilizers-list',
                            component: () => import('@/views/pages/management/fertilizers/fertilizers-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'fertilizers-create',
                            component: () => import('@/views/pages/management/fertilizers/fertilizers-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/fertilizerCategories',
                    name: 'fertilizer_categories',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'fertilizer_categories-list',
                            component: () => import('@/views/pages/management/fertilizer-categories/fertilizer-categories-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'fertilizer_categories-create',
                            component: () => import('@/views/pages/management/fertilizer-categories/fertilizer-categories-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'questions-list',
                            component: () => import('@/views/pages/management/questions/questions-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'questions-create',
                            component: () => import('@/views/pages/management/questions/questions-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/regions',
                    name: 'regions',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'regions-list',
                            component: () => import('@/views/pages/management/regions/regions-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'regions-create',
                            component: () => import('@/views/pages/management/regions/regions-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/seasons',
                    name: 'seasons',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'seasons-list',
                            component: () => import('@/views/pages/management/seasons/seasons-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'seasons-create',
                            component: () => import('@/views/pages/management/seasons/seasons-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/units',
                    name: 'units',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'units-list',
                            component: () => import('@/views/pages/management/units/units-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'units-create',
                            component: () => import('@/views/pages/management/units/units-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/about-us',
                    name: 'about_us',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'about_us-list',
                            component: () => import('@/views/pages/settings/about-us/aboutUs.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'about_us-create',
                            component: () => import('@/views/pages/management/units/units-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/landing',
                    name: 'landing',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'landing-list',
                            component: () => import('@/views/pages/website-settings/landing/landing-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/languages',
                    name: 'languages',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'languages-list',
                            component: () => import('@/views/pages/settings/languages/languages-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'languages-create',
                            component: () => import('@/views/pages/settings/languages/languages-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'info',
                            name: 'languages-info',
                            component: () => import('@/views/pages/settings/languages/languages-info.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/news',
                    name: 'news',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'news-list',
                            component: () => import('@/views/pages/website-settings/news/news-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'news-create',
                            component: () => import('@/views/pages/website-settings/news/new-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/usefullinfos',
                    name: 'usefull_infos',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'usefull_infos-list',
                            component: () => import('@/views/pages/management/usefull-infos/usefull-infos-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'AuthLogin',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/Auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/Auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(guard);

export default router;
