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
                // return next({ name: 'accessDenied' });
                return next();
            }
        }
        next();
    } catch (err) {
        console.log(err);
        next();
    }
}
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'Dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                }, {
                    path: '/chat-statictik',
                    name: 'chat_statictik',
                    component: () => import('@/views/pages/chat-statistik/chat-statistik-list.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue'),

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
                        //     component: () => import('@/views/pages/crops/crops-info.vue'),
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
                        //     component: () => import('@/views/pages/crops/crops-info.vue'),
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
                    name: 'cropsCategory',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'cropsCategory-list',
                            component: () => import('@/views/pages/management/crops-category/crops-category-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'cropsCategory-create',
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
                    name: 'diseaseCategories',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'diseaseCategories-list',
                            component: () => import('@/views/pages/management/disease-categories/disease-categories-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'diseaseCategories-create',
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
                    name: 'drugCategories',
                    component: () => import('@/views/pages/index.vue'),
                    children: [
                        {
                            path: '',
                            name: 'drugCategories-list',
                            component: () => import('@/views/pages/management/drug-categories/drug-categories-list.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        },
                        {
                            path: 'forms/:id',
                            name: 'drugCategories-create',
                            component: () => import('@/views/pages/management/drug-categories/drug-categories-create.vue'),
                            meta: { requiresAuth: true, role: ['admin'] }
                        }
                    ]
                },
                // {
                //     path: '/management',
                //     name: 'management',
                //     children: [
                //         {
                //             path: '/activity-types',
                //             name: 'management-list-activity-types',
                //             component: () => import('@/views/pages/management/activity-types/products-list.vue'),
                //             children:[
                //                {
                //                    path: '',
                //                    name: 'management-activity-types-list',
                //                    component:() => import('@/views/pages/management/activity-types/activity-types-list.vue'),
                //                    meta: { requiresAuth: true, role: ['admin'] }
                //                }
                //            ]
                //         },
                //         {
                //             path: 'forms/:id',
                //             name: 'crops-create',
                //             component: () => import('@/views/pages/crops/crops-create.vue'),
                //             meta: { requiresAuth: true, role: ['admin'] }
                //         },
                //         {
                //             path: 'info',
                //             name: 'crops-info',
                //             component: () => import('@/views/pages/crops/crops-info.vue'),
                //             meta: { requiresAuth: true, role: ['admin'] }
                //         }
                //     ],
                //     // meta: { requiresAuth: true, role: 'admin' }
                // },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue'),
                    meta: { requiresAuth: true, role: ['admin'] }
                }
                // {
                //     path: '/pages/crud',
                //     name: 'crud',
                //     component: () => import('@/views/pages/Crud.vue'),
                //     meta: { requiresAuth: true, role:[ 'admin'] }
                // },
                // {
                //     path: '/documentation',
                //     name: 'documentation',
                //     component: () => import('@/views/pages/Documentation.vue'),
                //     meta: { requiresAuth: true, role: ['admin'] }
                // }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
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
