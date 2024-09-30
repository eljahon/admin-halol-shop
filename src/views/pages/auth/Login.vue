<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import logo from '@/assets/image/growz.png';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { actions } from '@/utils/Store_Schema';
import { useStore } from 'vuex';
const { t } = useI18n();
const router = useRouter();
const store = useStore();
const { postLogin } = actions('login', { post: true });
const isSubmit = ref(false);
let validationSchema = yup.object({
    identifier: yup.string().required(t('login') + ' ' + t('required-field')),
    password: yup.string().required(t('password') + ' ' + t('required-field'))
});
const initialValues = {
    identifier: '',
    password: ''
};
const { errors, defineField, handleSubmit } = useForm({
    validationSchema,
    initialValues
});
const [identifier] = defineField('identifier');
const [password] = defineField('password');
const handleSubmitFrom = handleSubmit(async (value) => {
    isSubmit.value = true;
    postLogin({ ...value })
        .then((res) => {
            localStorage.setItem('token', res.jwt);
            store
                .dispatch('getUserMe')
                .then((res) => {
                    localStorage.setItem('role', res?.role?.description)
                    isSubmit.value = false;
                    if(res?.role?.description === 'consultant') router.push('/chat');
                    else router.push('/');
                })
                .catch((err) => {
                    isSubmit.value = false;
                });
        })
        .catch((err) => {
            isSubmit.value = false;
        });
    // router.push('/')
});
onMounted(() => {
    localStorage.clear()
})
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="flex justify-center items-center gap-2">
                            <img width="60" height="60" :src="logo" alt="logo image" />
                            <h1 class="text-6xl font-bold">{{ $t('logo-title') }}</h1>
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-4 mt-2">{{ $t('welcome-to-growz-admin') }}</div>
                        <span class="text-muted-color font-medium">{{ $t('sign-continue') }}</span>
                    </div>

                    <div>
                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">{{ $t('login') }}</label>
                            <InputText :invalid="errors.login" id="email1" type="text" :placeholder="$t('login')" class="w-full md:w-[30rem]" v-model="identifier" />
                        </div>
                        <small id="title-help" class="p-error text-red-500">
                            {{ errors.login }}
                        </small>

                        <div>
                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ $t('password') }}</label>
                            <Password :invalid="errors.password" id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        </div>
                        <small id="title-help" class="p-error text-red-500">
                            {{ errors.password }}
                        </small>
                        <Button :loading="isSubmit" type="submit" @click="handleSubmitFrom" :label="$t('sign-in')" class="w-full"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
