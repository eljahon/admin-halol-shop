<script setup>
import Tabs from 'primevue/tabs';
import { tabList } from '@/constants';
import Tab from 'primevue/tab';
import SocketIo from 'socket.io-client';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { _ } from '../../../../dist/assets/_plugin-vue_export-helper-DlAUqK2U';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const route = useRoute();
const store = useStore();
const toast = useToast();
const { t } = useI18n();
const count = ref('0')
const url = import.meta.env.VITE_APP_AWS_PATH;
const fileLoading = ref(false);
const isMessageLoading = ref(false);
const isDialogOpen = ref(false);
const isDiseasesModalOpen = ref(false);
const isFinisht = ref(false);
const isDisieases = ref(false);
const isFinishedLoading = ref(false);
const isSendLoading = ref(false);
const text = ref(undefined);
const medias_text = ref(undefined);
const scrollcss = ref(undefined);
const medias = ref([]);
const diseases = ref([]);
const content = ref(undefined);
const consultandData = ref(undefined);

let socket = SocketIo(`${import.meta.env.VITE_APP_WS_URL}/?token=` + localStorage.getItem('token'));
const currentAvtiveUser = ref({ fullname: 'Asiya Javayant' });
const currentTab = ref(route.query?.tab ?? '0');
const routerPush = async (payload) => {
    const _query = { ...route.query };
    return await router.replace({ query: { ..._query, ...payload } });
};
const updateChatCheck = async (req) => {

    if (req.data.finished) {
        await routerPush({ tab: '2' });
        await getDate()
        return true;
    }
    if (req.data.consultant.id === consultandData.value.id) {
        await routerPush({ tab: '1' });
        await getDate()
        return true;
    }
    if (req.data.consultant.username === 'bot' && !req.data.draft) {
        await routerPush({ tab: '0' });
        await getDate()
        return true;
    }

};
async function handleTabChange(item) {
    await routerPush({ tab: item });
    await getDate();
}
async function getMessages(id) {
    try {
        isMessageLoading.value = true;
        const chatId = route.query?.chatId || id || undefined;
        const data = await store.dispatch('getMessages', { chat: chatId });
        if (data) isMessageLoading.value = false;
        scrollToBottomInChatLog();
        return data;
    } catch (err) {
        isMessageLoading.value = false;
    }
}
async function handleClickItemChat(item) {
    currentAvtiveUser.value = item;
    await routerPush({ chatId: item.id });
    await getMessages(item.id);
}
async function getDate() {
    const _currenTab = route.query.tab ?? undefined;
    const _chatId = route.query.chatId ?? undefined;
    let _finishList = { 0: undefined, 1: false, 2: true };
    if (_finishList[_currenTab] || _finishList[_currenTab] === false)
        return await store.dispatch('getChats', { finished: _finishList[_currenTab] }).then((res) => {
            if (_chatId) currentAvtiveUser.value = res.find((el) => el.id == _chatId);
        });
    else return await store.dispatch('getNewChats', { populate: '*' });
}
async function getDiseasesList() {
    try {
        isDisieases.value = true;
        const data = await store.dispatch('getChatDiseases', { id: route.query.chatId, params: { populate: '*' } });
        if (data) {
            diseases.value = data;
            isDisieases.value = false;
            isDiseasesModalOpen.value = true;
        }
    } catch (err) {
        console.log(err);
        isDisieases.value = false;
    }
}
async function senDrugMessage(item) {
    isDisieases.value = true;
    let _data = {};
    _data.text = item.name ? item.name : item.title;
    _data.sender = +currentAvtiveUser?.value?.id;
    _data.chat = +route.query.chatId;
    _data.medias = item.image ? [item.image.id] : [];
    _data.state = {
        type: 'relation',
        model: 'disease',
        id: item.id
    };
    store.dispatch('postChatNewMessage', { data: _data }).then(() => {
        isDiseasesModalOpen.value = false;
        isDisieases.value = false;
    });
}
async function finishedChat () {
    isFinisht.value =true
}
async function deleteProduct () {
    const data = await  store.dispatch('finishChat', route.query.chatId)
    if(data) {
        isFinisht.value = false
        isFinishedLoading.value = false
    }
}
function chatFileUplaod() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
        fileLoading.value = true;
        const _file = input.files[0];
        store
            .dispatch('uploadFile', { data: { file: _file }, type: 'image', folder: 'other' })
            .then((res) => {
                console.log(res.media);
                fileLoading.value = false;
                medias.value = [{ id: res.media.id, aws_path: res.media.aws_path }];
                isDialogOpen.value = true;
                // sendMessage();
            })
            .finally(() => {
                fileLoading.value = false;
            });
        // data: formData,
        //     folder: "other",
        //     type: "image",
        console.log(_file);
    });
    input.click();
}
async function sendMessage() {
    isSendLoading.value = true;
    try {
        if (text.value) {
            const _data = {
                text: text.value,
                content: content.value ?? '',
                sender: consultandData.value.id,
                chat: route.query.chatId ? +route.query.chatId : undefined,
                medias: []
            };
            const data = await store.dispatch('postChatNewMessage', { data: _data });
            if (data) isSendLoading.value = false;
            return await data;
        } else {
            isSendLoading.value = false;
            toast.add({ severity: 'info', summary: t('plase-media-and-text-choose'), detail: t('media-and-text-choose'), life: 3000 });
        }
    } finally {
        isSendLoading.value = false;
    }
}
async function sendMessageAndMedia() {
    isSendLoading.value = true;
    try {
        if (medias_text.value && medias?.value?.length) {
            const _data = {
                text: medias_text.value,
                content: content.value ?? '',
                sender: consultandData.value.id,
                chat: route.query.chatId ? +route.query.chatId : undefined,
                medias: medias.value.length ? [medias.value[0].id] : []
            };
            const data = await store.dispatch('postChatNewMessage', { data: _data });
            if (data) {
                isSendLoading.value = false;
                isDialogOpen.value = false;
            }
            return await data;
        } else {
            isSendLoading.value = false;
            // isDialogOpen.value =false
            toast.add({ severity: 'info', summary: t('plase-media-and-text-choose'), detail: t('media-and-text-choose'), life: 3000 });
        }
    } finally {
        isSendLoading.value = false;
        // isDialogOpen.value =false
    }
}
function getUserMe() {
    store.dispatch('getUserMe').then((res) => {
        consultandData.value = res;
    });
}
const scrollToBottomInChatLog = () => {
    setTimeout(() => {
        const scrollEl = scrollcss.value.$el || scrollcss.value;
        scrollEl.scrollTop = scrollEl.scrollHeight;
    }, 0);
};
getUserMe();
onMounted(async () => {
    await getDate();
    if (route.query.chatId) await getMessages(route.query.chatId);
    socket.connect();
    socket.on('chat', async (req) => {
        if (req.mode === 'update') updateChatCheck(req);
    });
    socket.on('message', (req) => {
        if (req.data.chat.id === +route.query.chatId) {
            text.value = '';
            store.dispatch('postChatWebSockerMessages', {
                text: req.data.text,
                content: req.data.content,
                medias: req.data.medias,
                sender: req.data.sender,
                state: req.data.state,
                relation: req.data.relation,
                read: req.data.read,
                id: req.data.id
            });
            scrollToBottomInChatLog();
            // console.log('dataMessages:', chatMessageStore.dataMessages);
        }
    });
});
onBeforeUnmount(() => {
    socket.disconnect();
});
watch(() =>route.query.tab , (value) => {
    currentTab.value = value
})
</script>
<template>
    <div class="w-full">
        <TheBreadcrumb class="hidden sm:block" />
        <Dialog v-model:visible="isDialogOpen" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('media message') }}</h1>
            </template>
            <div class="">
                <div>
                    <Image :src="url + medias[0]?.aws_path" preview />
                </div>
                <div class="flex justify-between w-full gap-2">
                    <InputText v-model="medias_text" class="w-full" placeholder="type" />
                    <Button @click="chatFileUplaod" v-tooltip.top="{ value: $t('file-upload') }" :loading="fileLoading" icon="pi pi-upload" class="w-full max-w-[50px]" />
                    <Button :loading="isSendLoading" v-tooltip.top="{ value: $t('send-new-message') }" :label="$t('send')" class="w-full max-w-[100px]" @click="sendMessageAndMedia" />
                </div>
            </div>
            <template #footer>
                <!--                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteCropDialog = false" />-->
                <!--                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />-->
            </template>
        </Dialog>
        <Dialog v-model:visible="isDiseasesModalOpen" :style="{ width: '350px', height: '400px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('diseases-type') }}</h1>
            </template>
            <div class="">
                <div v-for="(item, index) in diseases" :key="index" @click="senDrugMessage(item)" class="box-shadow">
                    <div class="flex gap-3 mt-2 items-center">
                        <Image imageStyle="border-radius: 50%; height: 50px; width: 50px" class="w-[50px] h-[50px]" :src="url + item.image?.aws_path" preview />
                        <span class="text-primary">{{ item?.name ?? '--' }}</span>
                    </div>
                </div>
            </div>
            <template #footer>
                <!--                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteCropDialog = false" />-->
                <!--                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />-->
            </template>
        </Dialog>
        <Dialog v-model:visible="isFinisht" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h1 class="text-3xl text-center">{{ $t('dou-you-want-finish-chat') }}</h1>
            </template>
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span
                > <b>{{ $t('dou-you-want-finish-chat')}}</b
                >?</span
                >
            </div>
            <template #footer>
                <Button severity="Danger" outlined :label="$t('no')" icon="pi pi-times" text @click="deleteCropDialog = false" />
                <Button :label="$t('yes')" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>
        <div class="flex flex-col sm:flex-row gap-6 myHight">
            <div class="w-full sm:max-w-[300px] bg-white dark:bg-surface-900 rounded-lg shadow h-[200px] sm:h-full overflow-scroll scrollcss">
                <div class="w-full text-center hidden sm:flex gap-4 items-center px-4 py-4 border-b dark:border-b-blue-400/10 border-gray-200">
                    <h4 class="text-xl font-bold text-primary text-center">{{ $t('chats') }}</h4>
                </div>
                <Tabs :value="currentTab" @update:value="handleTabChange">
                    <TabList class="overflow-x-scroll scrollcss sticky">
                        <Tab v-for="(item, index) in tabList" :value="'' + item.id" :key="item.id">{{ $t(item.title) }}</Tab>
                    </TabList>
                </Tabs>
                <div class="p-4">
                    <template v-if="!store.getters.getChatLoading">
                        <div
                            v-for="(item, index) in store.getters?.getChatList"
                            :key="index"
                            class="w-full cursor-pointer mb-2 flex dark:bg-blue-400/10 items-center gap-3 p-2 border rounded-lg dark:hover:bg-blue-400/10 hover:bg-gray-100 dark:border-blue-400/10 border-gray-200"
                            @click="handleClickItemChat(item)"
                        >
                            <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                            <div class="">
                                <h3 class="text-base font-bold" :class="[route.query.chatId == item.id ? 'text-primary' : '']">{{ item?.user?.fullname ?? '-' }}</h3>
                                <p class="text-xs" :class="[route.query.chatId == item.id ? 'text-primary' : '']">{{ item?.title ?? '-' }}</p>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            v-for="(item, index) in 8"
                            :key="index"
                            class="w-full cursor-pointer mb-2 flex dark:bg-blue-400/10 items-center gap-3 p-2 border rounded-lg dark:hover:bg-blue-400/10 hover:bg-gray-100 dark:border-blue-400/10 border-gray-200"
                        >
                            <Skeleton width="100%" height="4rem" />
                        </div>
                    </template>
                </div>
            </div>
            <div class="w-full h-full flex flex-col justify-between bg-white dark:bg-surface-900 rounded-lg shadow">
                <div class="w-full">
                    <div class="w-full border-b border-gray-200 dark:border-b-blue-400/10">
                        <div v-if="!store.getters.getChatLoading" class="w-full cursor-pointer flex items-center gap-3 p-4">
                            <Avatar icon="pi pi-user" class="my-auto" size="large" shape="circle" />
                            <div class="text-primary">
                                <h3 class="text-base font-bold text-primary">{{ currentAvtiveUser?.user?.fullname ?? '-' }}</h3>
                                <p class="text-xs">{{ currentAvtiveUser?.title ?? '-' }}</p>
                            </div>
                        </div>
                        <div v-else class="w-full cursor-pointer mb-2 flex dark:bg-blue-400/10 items-center gap-3 p-2 border rounded-lg dark:hover:bg-blue-400/10 hover:bg-gray-100 dark:border-blue-400/10 border-gray-200">
                            <Skeleton width="100%" height="4rem" />
                        </div>
                    </div>
                    <div class="w-full max-h-[400px] scrollcss overflow-scroll p-4" id="scrollcss" ref="scrollcss">
                        <template v-if="!isMessageLoading">
                            <template v-for="(item, index) in store.getters.getMessages" :key="index">
                                <div v-if="item.sender.id === consultandData?.id || item.sender?.fullname === 'Growz Bot'" class="flex justify-end w-full text-end mb-2">
                                    <div v-if="item.medias.length === 0" class="border rounded border-gray-200 bg-green-200 text-green-800 p-2">{{ item?.text ?? '-' }}</div>
                                    <div v-else class="border rounded border-gray-200 bg-green-200 text-green-800 p-2">
                                        <Image width="250" height="250" class="block" :src="url + item.medias[0].aws_path" preview />
                                        <p class="text-center">{{ item?.text ?? '-' }}</p>
                                    </div>
                                </div>
                                <div v-else class="mb-2">
                                    <!--                                    <template>-->
                                    <div v-if="item.medias.length === 0" class="border w-2/5 rounded border-gray-200 p-2 my-1">{{ item?.text ?? '-' }}</div>
                                    <div v-else class="border rounded border-gray-200 text-green-800 p-2 w-[250px]">
                                        <Image width="250" height="250" class="block" :src="url + item.medias[0].aws_path" preview />
                                        <p class="text-center">{{ item?.text ?? '-' }}</p>
                                    </div>
                                    <p class="text-gray-400 w-2/5 text-right">{{ dayjs(item.createAt).format('HH:mm') }}</p>
                                    <!--                                    </template>-->
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <template v-for="(item, index) in 10" :key="index">
                                <div class="mb-2" v-if="index % 2 === 0">
                                    <Skeleton width="50%" height="4rem" />
                                </div>
                                <div v-else class="flex justify-end w-full text-end mb-2">
                                    <Skeleton width="50%" height="4rem" />
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
                <div v-if="route.query.tab === '1'||route.query.tab === '0'" class="w-full flex items-center justify-between border-t border-gray-200 gap-4 p-4">
                    <Button :disabled="!Boolean(route.query.chatId)" :loading="isDisieases" v-tooltip.top="{ value: $t('disease_category') }" class="w-full max-w-[100px]" :label="$t('disease')" @click="getDiseasesList" />

                    <div class="flex justify-between w-full gap-2">
                        <InputText v-model="text" class="w-full" placeholder="type" />
                        <Button :loading="isFinishedLoading" v-tooltip.top="{ value: $t('dou-you-want-finish-chat') }" icon="pi pi-flag" class="w-full max-w-[50px]" @click="finishedChat"/>
                        <Button @click="chatFileUplaod" v-tooltip.top="{ value: $t('file-upload') }" :loading="fileLoading" icon="pi pi-upload" class="w-full max-w-[50px]" />
                        <Button :loading="isSendLoading" v-tooltip.top="{ value: $t('send-new-message') }" :label="$t('send')" class="w-full max-w-[100px]" @click="sendMessage" />
                    </div>
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
.app-dark .scrollcss::-webkit-scrollbar-track {
    background: #000;
}

/* Handle */
.scrollcss::-webkit-scrollbar-thumb {
    background: #888;
}
.app-dark .scrollcss::-webkit-scrollbar-thumb {
    background: #000000;
}

/* Handle on hover */
.scrollcss::-webkit-scrollbar-thumb:hover {
    background: #555;
}
.box-shadow {
    transition: all 0.5s ease;
    padding: 2px;
    border-radius: 10px;
}
.box-shadow:hover {
    transition: all 0.5s ease;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
