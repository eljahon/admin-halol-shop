<script setup>
import TheBreadcrumb from '@/components/The-Breadcrumb.vue';
import { ref } from 'vue';
import TheTabs from '@/components/TheTabs.vue';
import CropInfo from '@/components/Crop-Info/Crop-Info.vue';
import { useRoute, useRouter } from 'vue-router';
import CropDiseases from '@/components/Crop-Info/Crop-Diseases.vue';
import CropNew from '@/components/Crop-Info/Crop-New.vue';
import CropFertilizers from '@/components/Crop-Info/Crop-Fertilizers.vue';
const route = useRoute()
const router = useRouter()
const currentTab = ref(route.query.tab ? +route.query.tab : 0)
const tabList = ref([
    { label: 'description', id: 0, key: null, icon: 'pi pi-info-circle' },
    { label: 'diseases', id: 1, key: 'plants', icon: 'pi pi-info-circle' },
    { label: 'news', id: 2, key: 'news', icon: 'pi pi-info-circle' },
    { label: 'fertilizers', id: 3, key: 'fertilizers', icon: 'pi pi-info-circle' }
]);
async function routerPush(param) {
    const _query = { ...route.query, ...param };
    await router.replace({ query: _query });
    // getDiseasesList();
}
function onChangeTabs(value) {
    // console.log(value);
    currentTab.value = value.id
    if (value.key) routerPush({ user: value.key, page: 1 });
    else routerPush({ user: undefined });
}
let renderComponets = {
    0: CropInfo,
    1: CropDiseases,
    2: CropNew,
    3:CropFertilizers
}

</script>

<template>
    <div>
        <TheBreadcrumb />

     <TheTabs :tabs-list="tabList" @on-change-tab="onChangeTabs">
     </TheTabs>
        <div>
            <component :is="renderComponets[currentTab]"></component>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
