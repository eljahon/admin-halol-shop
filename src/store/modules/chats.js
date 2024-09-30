import request from '@/utils/request';
const sub_url = '/about';

export const Chats = {
    state: () => ({
        messages: undefined,
        chatList: undefined,
        chatLoading: false
    }),
    getters: {
        getChatList: (state) => state.chatList,
        getChatLoading: (state) => state.chatLoading,
        getMessages: (state) => state.messages
    },
    mutations: {
        SET_MESSAGES: (state, payload) => {
            state.messages = payload;
        },
        SET_CHAT_LOADING: (state, payload) => {
            state.chatLoading = payload;
        },
        SET_CHAT_LIST: (state, payload) => {
            state.chatList = payload;
        }
    },
    actions: {
        getNewChats({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_CHAT_LOADING', true);
                request
                    .get('/new/chats', { params: { ...payload } })
                    .then((res) => {
                        console.log(res);
                        commit('SET_CHAT_LIST', res);
                        commit('SET_CHAT_LOADING', false);
                        resolve(res);
                    })
                    .catch((err) => {
                        commit('SET_CHAT_LOADING', false);
                        reject(err);
                    });
            });
        },
        getChatDiseases({ commit }, payload) {
            return new Promise((resolve, reject) => {
                // commit('SET_CHAT_LOADING', true);
                request
                    .get(`/chat/${payload.id}/diseases`, { params: { ...payload.paramas } })
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        // commit('SET_CHAT_LOADING', false);
                        reject(err);
                    });
            });
        },
        postChatNewMessage({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .post('messages', { ...payload })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getChats({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_CHAT_LOADING', true);
                const populate = 'consultant, state, user, user.avatar, user.role';
                request
                    .get('/chats', { params: { populate, filters: payload, sort: ['createdAt:desc'], pagination: { page: 1, pageSize: 9999 } } })
                    .then((res) => {
                        commit('SET_CHAT_LIST', res.data);
                        resolve(res.data);
                        commit('SET_CHAT_LOADING', false);
                    })
                    .catch((er) => {
                        commit('SET_CHAT_LOADING', false);
                        reject(er);
                    });
            });
        },
        getMessages({ commit }, payload) {
            return new Promise((resolve, reject) => {
                request
                    .get('messages', { params: { ...payload, sort: ['createdAt:asc'], pagination: { page: 1, pageSize: 9999 } } })
                    .then((res) => {
                        commit('SET_MESSAGES', res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        commit('SET_MESSAGES', []);
                        reject(err);
                    });
            });
        },
        postChatWebSockerMessages({ commit, state }, payload) {
            // console.log(payload, 'payload postChatWebSockerMessages');
            const _stateMassage = JSON.parse(JSON.stringify(state.messages));
            _stateMassage.push(payload);
            commit('SET_MESSAGES', _stateMassage);
        },
        async finishChat({commit}, payload) {
            console.log(payload);
            return await request.patch(`/chat/finish/${payload}`);
        },
    }
};
