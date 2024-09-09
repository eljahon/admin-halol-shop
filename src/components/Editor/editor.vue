// onMounted(() => { // editor.value = new Quill(document.getElementById('editor'), { // theme: 'snow', // modules: { // toolbar: { // container: toolbarOptions, // handlers: { // image: imageHandler // } // } // }, // readOnly: false // }); //
editor.value.on('text-change', handleTextChange); // editor.value.on('selection-change', handleSelectionChange); // });
<script setup>
import { onMounted, ref, watch, defineProps, defineModel } from 'vue';
import { useStore } from 'vuex';
import Editor from 'primevue/editor';
const editor = ref();
const store = useStore();
const url = import.meta.env.VITE_APP_AWS_PATH;
const emit = defineEmits(['update:modelValue']);
const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean']
];
const htmlText = ref;
function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
        const file = input.files[0];
        store.dispatch('uploadFileEditor', { folder: 'other', data: { file } }).then((res) => {
            const {
                media: { aws_path }
            } = res;
            const imageUrl = url + aws_path;
            const range = editor.value.quill.getSelection() || { index: editor.value.getLength() };
            editor.value.quill.insertEmbed(range.index, 'image', imageUrl);
            editor.value.quill.setSelection(range.index + 1);
        });
    };
}

const props = defineProps(['modelValue']);
watch(
    () => props.modelValue,
    (newValue) => {
        if (editor.value) {
            const itemHtml = editor.value.quill?.clipboard.convertHTML(newValue);
            editor.value.quill.setContents(itemHtml);
            editor.value.quill.setSelection(itemHtml.length());
            htmlText.value = newValue;
        }
    }
);
function onChangeModelValue(value) {
    emit('update:modelValue', value);
}
</script>

<template>
    <Editor
        ref="editor"
        v-model="htmlText"
        @update:modelValue="onChangeModelValue"
        :modules="{
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    image: imageHandler
                }
            }
        }"
    >
        <template v-slot:toolbar>
            <span class="ql-formats">
                <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
            </span>
        </template>
    </Editor>
</template>
