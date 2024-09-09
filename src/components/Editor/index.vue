<script setup>
import Quill from 'quill';
import 'quill/dist/quill.core.css' // Required
import 'quill/dist/quill.snow.css' // For snow theme (optional)
import 'quill/dist/quill.bubble.css' // For bubble theme (optional)
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
const editor = ref();
const store = useStore();
const url = import.meta.env.VITE_APP_AWS_PATH;
const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean']
];
const props = defineProps(['modelValue']);
watch(
    () => props.modelValue,
    (newvalue) => {
        console.log(newvalue, '=====>>');
    }
);
function imageHandler(value) {
    console.log(value);
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
        const file = input.files[0];

        store.dispatch('uploadFileEditor', { folder: 'other', data: { file } }).then((res) => {
            const {
                data,
                media: { aws_path }
            } = res;
            editor.value.insertEmbed(editor.value.getLength() - 1, 'image', url + aws_path);
            // editor.value.focus()
            const range = editor.value?.getSelection()||undefined;
            if (range) editor.value.insertEmbed(range.index, 'image', url + aws_path);
            else {
                editor.value.insertEmbed(editor.value.getLength() - 1, 'image', url + aws_path);
                editor.value.setSelection(editor.value.getLength());
            }
        });
    };
}
onMounted(() => {
    editor.value = new Quill(document.getElementById('editor'), {
        theme: 'snow',
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    image: imageHandler
                }
            }
        },
        readOnly: false
    });
    document.getElementById('editor').addEventListener('click', function() {
        editor.value.focus();
    });
    // console.log(editor.value);
    // editor.value.setSelection(editor.value.getLength());

    // for(let key in editor) {
    //     console.log(`${key} event name or key`);
    // }
});
</script>

<template>
    <div id="editor"></div>
</template>

<style scoped lang="scss"></style>
