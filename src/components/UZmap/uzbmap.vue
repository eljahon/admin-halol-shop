<script setup>
import { svgPath } from '@/constants/uzbMapPath';
import { ref } from 'vue';
const emit = defineEmits(['handelItem']);
const hovered = ref(false);
const props = defineProps({
    id: {
        type: Number,
        required: false
    }
});
function clickPath(event, regionId) {
    emit('handelItem', regionId);
}
const hoverHandler = function (hoverdedVValue) {
    hovered.value = hoverdedVValue;
};
</script>

<template>
    <div>
        <div style="widows: 100%">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" aria-label="Map of Uzbekistan">
                <path
                    v-for="item in svgPath"
                    :key="item.id"
                    :d="item.d"
                    :id="item.id"
                    :fill="item.fill"
                    @mouseover="hoverHandler(item.name)"
                    @mouseout="hoverHandler(null)"
                    :class="[hovered === item.name ? 'hovered' : 'salom', item.id === id ? 'hovered' : '']"
                    @click="(event) => clickPath(event, item)"
                />
            </svg>
        </div>
    </div>
</template>

<style scoped>
svg {
    position: relative;
    overflow: hidden;
}

.hovered {
    z-index: 9999;
    stroke: rgba(0, 0, 0, 50%);
    stroke-width: 2;
    transform-origin: center;
}
</style>
