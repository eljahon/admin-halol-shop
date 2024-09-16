<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

const url = import.meta.env.VITE_APP_AWS_PATH;
const toast = useToast();
const loading = ref(false)
const emit = defineEmits(['update:modelValue', 'delete']);
let props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    folder:{
        type:String,
        required: true,
        default:() => 'other'
    }
});

const store = useStore();

const onTemplatedUpload = async (event) => {
    loading.value = true;
    if (!event.target.files[0]) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No file selected', life: 3000 });
        return;
    }

    const payload = { file: event.target.files[0] };

    store.dispatch('uploadFile', { data:payload, folder: props.folder })
        .then((res) => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 3000 });
            emit('update:modelValue', res);
            loading.value = false;
        })
        .catch((err) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
            loading.value = false;
        });
};
const delteImagefun = () => {
    emit('delete');
}

// watch(() => props.modelValue, (value) => {
//     console.log(value);
// })
</script>
<template>
    <div class="w-full">
        <Toast />
        <div class="file">
            <div v-if="modelValue" class="image-wrap">
<!--                <Image :src="url + modelValue" alt="Image" width="250" preview />-->
                <video :src="url + modelValue?.aws_path" controls width="500" height="500"></video>
            </div>
            <div v-else class="file-wrap">
                <div v-if="loading" style="font-size: 4

                rem">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                                     animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                </div>
                <i v-else class="pi pi-video text-red" style="font-size: 5rem"></i>
            </div>
            <div class="flex gap-2">
                <Button severity="danger" icon="pi pi-trash" v-if="modelValue" @click="delteImagefun"
                        class="inline-block" />
                <label class="inline-block p-button p-component p-button-icon-only p-button-success inline-block">
                    <input type="file" class="hidden" accept="video/*" @change="onTemplatedUpload">
                    <div class="btn">
                        <i class="pi pi-upload"></i>
                    </div>
                </label>
            </div>

        </div>
    </div>
</template>


<style scoped>
.file {
    width: 100%;
    max-width: 250px;
    text-align: center;
}

.file-wrap {
    width: 100%;
    max-width: 200px;
    border-radius: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: aliceblue;
    margin: 0 auto;
    margin-bottom: 15px;
}

.image-wrap {
    width: 100%;
    max-width: 250px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn {
    border-radius: 5px;
    color: white;
    cursor: pointer;

}

</style>
