<template>
    <div class="d-flex align-center justify-center mt-5 mb-3 flex-column">
        <h3 class="text-center">{{ $t('no-data') }}</h3>
        <img :src="empty" class="w100" />
    </div>
</template>

<script setup>
import EmptyImage from "../assets/image/empty_box.png";
import {ref} from "vue";
const empty = ref(EmptyImage);
</script>

<style scoped>
.w100 {
    width: 200px;
}
@media only screen and (max-width: 600px) {
    .w100 {
        width: 70px;
    }
}
</style>
