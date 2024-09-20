
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const props = defineProps({
    tabsList:{
        type: Array,
        required: true,
        default: () => []
    }
})
const emit =defineEmits(['onChangeTab'])
const router = useRouter()
const route = useRoute()
const currentTab = ref(route.query?.tab ?? '0')
async function onChangeTabs(value) {
    const _query ={...route.query}
    // console.log(value);
    await router.replace({query:{..._query, tab: value}})
    await emit('onChangeTab', props.tabsList.find(el=> el.id == value))

}
</script>
<template>
    <div class="rounded my-2">
        <Tabs :value="currentTab" @update:value="onChangeTabs">
            <TabList>
                <Tab class="flex  items-center gap-5" v-for="(item, index) in tabsList" :value="`${item.id}`" :key="index"><i v-if="item?.icon" :class="[item.icon]" style="font-size: 1.5rem"></i> <span>{{$t(`${item.label}`)}}</span></Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="(item, index) in tabsList" :key="index" :value="`${item.id}`">
                    <slot v-bind="item">
                    </slot>

                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
