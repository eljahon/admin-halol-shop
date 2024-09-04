<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// const routerList = router.currentRoute.value.path.split('/');
let breadcrumbItems = ref([{ label: route.name.split('-')[0], icon: undefined, to:{name: route.name.split('-')[0]}}]);

function formatRouter() {
    // console.log(route, '==>>');
    if(route.name.split('-').includes('create')&&route.params.id === 'new'){
        breadcrumbItems.value.push({
            label: 'create',
            icon: undefined,
            to: {name: route.name}
        })
    } else if(route.name.split('-').includes('create')&&route.params.id !== 'new') {
        breadcrumbItems.value.push({
            label: 'update',
            icon: undefined,
            to: {name: route.name}
        })
    } else if(route.name.split('-').includes('info')){
        breadcrumbItems.value.push({
        label: 'info',
        icon: undefined,
        to: {name: route.name}
    })
    }
    // console.log(breadcrumbItems, '=>. itemsd');
    // const routerList = router.currentRoute.value.matched
    //     .filter((el) => el.path !== '/')
    //     .map((el) => {
    //         return {
    //             label: el.name.split('-')[0] + " " + (route.params.id === 'new' ? t('create') : route.params.id !== 'new' ? t('update') : t('info')),
    //             icon: undefined,
    //             to: el.path
    //         };
    //     });
    // console.log(routerList, 'list', router.currentRoute.value.matched);
    // breadcrumbItems.value = routerList.filter((el) => el.to !== '/');
    // breadcrumbHome.value = routerList.find(el => el.to === '/')
    // console.log(breadcrumbHome);
}
formatRouter();
</script>

<template>
    <Breadcrumb :home="{ label: '', icon: 'pi pi-home', to: '/' }" :model="breadcrumbItems" class="mb-4">
        <template #item="{ item, props,label }">
<!--           {{(function(){-->
<!--            console.log(itme, props, label)-->
<!--        })()}}-->

                <span>
                    <span :class="[item.icon, 'text-color', 'ml-2']" />
                    <span class="font-semibold active-route">{{ $t(label) }}</span>
                </span>
        </template>
    </Breadcrumb>
</template>

<style scoped lang="scss"></style>
