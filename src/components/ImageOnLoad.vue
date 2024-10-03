<script setup>
import { ref } from 'vue';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 100
    },
    height: {
        type: Number,
        default: 100
    },
    styles: {
        type: Object,
        default: () => ({})
    },
    rounded: {
        type: Boolean,
        default: false
    }
})
const loading = ref(true);
const error = ref(false);
const url = import.meta.env.VITE_APP_AWS_PATH;
function onLoad() {
    setTimeout(() => {
        loading.value = false;
    }, 500);
}
function onError() {
    loading.value = false;
    error.value = true;
}

if (!props.src) onError();
</script>

<template>
    <div class="image-wrapper" :class="[loading ? 'active' : '']" :style="{ width: `${width}px`, height:`${height}px` }">
        <div class="absolute w-full h-full flex items-center justify-center">
            <div v-if="loading" class="spinner"></div>
        </div>
        <Image v-if="rounded&&src"  :style="{...styles, borderRadius: '100px'}"  alt="Image"  preview>
            <template #image>
        <img style="border-radius: 100px; height: 70px; width: 70px" :src="url + src" alt="image"  @load="onLoad" @error="onError" />
    </template>
    <template #preview="slotProps">
        <img style="height: 400px; width: 400px" :src="url + src" alt="preview" :style="slotProps.style" @click="slotProps.onClick" />
    </template>
        </Image>
               <!-- <img :src="url + src" alt="" @load="onLoad" @error="onError" /> -->
        <div v-if="error" class="error-placeholder">{{ $t('image-not') }}</div>
    </div>
</template>

<style scoped lang="scss">
.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.active {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 20;
}
.spinner {
    position: absolute;
    top: 20%;
    left: 30%;
    transform: translate(-50%, -50%);
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #fff;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    z-index: 20;
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.error-placeholder {
    text-align: center;
    color: red;
    font-weight: bold;
    padding: 20px;
}
</style>
