<script setup>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import { ref } from 'vue';
const selectedCountry = ref();
</script>
<template>
    <div class="w-full">
        <TheBreadcrumb class="hidden sm:block" />
        <div class="flex flex-col sm:flex-row gap-6 myHight">
            <div class="w-full sm:max-w-[300px] bg-white rounded-lg shadow h-[200px] sm:h-full overflow-scroll scrollcss">
                <div class="w-full text-center hidden sm:flex gap-4 items-center px-4 py-4 border-b border-gray-200">
                    <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                    <h4 class="text-xl font-bold">Asiya Javayant</h4>
                </div>
                <Tabs value="0">
                    <TabList class="overflow-x-scroll scrollcss sticky">
                        <Tab value="0">Header I</Tab>
                        <Tab value="1">Header II</Tab>
                        <Tab value="2">Header III</Tab>
                        <Tab value="3">Header III</Tab>
                        <Tab value="4">Header III</Tab>
                    </TabList>
                </Tabs>
                <div class="p-4">
                    <!-- user data -->
                    <div class="w-full cursor-pointer mb-2 flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 border-gray-200">
                        <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                        <div>
                            <h3 class="text-base font-bold">User name</h3>
                            <p class="text-xs">name user</p>
                        </div>
                    </div>
                    <div class="w-full cursor-pointer mb-2 flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 border-gray-200">
                        <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                        <div>
                            <h3 class="text-base font-bold">User name</h3>
                            <p class="text-xs">name user</p>
                        </div>
                    </div>
                    <div class="w-full cursor-pointer mb-2 flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 border-gray-200">
                        <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                        <div>
                            <h3 class="text-base font-bold">User name</h3>
                            <p class="text-xs">name user</p>
                        </div>
                    </div>
                    <div class="w-full cursor-pointer mb-2 flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 border-gray-200">
                        <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                        <div>
                            <h3 class="text-base font-bold">User name</h3>
                            <p class="text-xs">name user</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-full flex flex-col justify-between bg-white rounded-lg shadow">
                <div class="w-full">
                    <div class="w-full border-b border-gray-200">
                        <div class="w-full cursor-pointer flex items-center gap-3 p-4">
                            <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                            <div>
                                <h3 class="text-base font-bold">User name</h3>
                                <p class="text-xs">name user</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-full max-h-[400px] scrollcss overflow-scroll p-4">
                        <div class="mb-2 flex">
                            <div class="border rounded border-gray-200 p-2">text</div>
                        </div>
                        <div class="flex justify-end w-full text-end mb-2">
                            <div class="border rounded border-gray-200 bg-green-200 text-green-800 p-2">my text</div>
                        </div>
                    </div>
                </div>
                <div class="w-full flex items-center border-t border-gray-200 gap-4 p-4">
                    <Select v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Select a Country" class="w-full md:w-56">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center">
                                <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Select>
                    <InputText class="w-full" placeholder="type" />
                    <Button label="send" class="w-full max-w-[100px]" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scope>
.myHight {
    height: calc(100vh - 174px);
}

@media only screen and (max-width: 640px) {
    .myHight {
        height: auto;
    }
}

.scrollcss::-webkit-scrollbar {
    height: 2px;
    width: 2px;
}

/* Track */
.scrollcss::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
.scrollcss::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
.scrollcss::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
