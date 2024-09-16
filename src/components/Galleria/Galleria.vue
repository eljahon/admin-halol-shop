
<template>
    <div class="card">
        <Galleria :value="galleriaList?.length ? galleriaList : images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 80%; height: 400px" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"  style="width: 100px; height: 100px"/>
            </template>
        </Galleria>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PhotoService } from '@/service/PhotoService';
import Galleria from 'primevue/galleria';
const props =defineProps(['galleriaList'])
onMounted(() => {
    PhotoService.getImages().then((data) => {
        console.log(data);
        images.value = data
    });
});

const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>
