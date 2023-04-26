<template>
    <div class="card">
        <div class="card mb-2 py-3" v-for="file in files" :key="file.name">
            <div>
                <i @click="removeFile(file)" class="pi pi-trash mr-3" style="color: red; cursor: pointer;"></i>
                {{ file.name + " " }}( {{ file.type }}, {{ (file.size / 1000).toString() }}kb )
            </div>
        </div>

        <div class="dropzone" @dragover.prevent @drop="onFileDrop" @click="onClick"
            :class="{ 'disabled': files.length > maxLength - 1 ? true : false }">
            <p>{{ dropzoneText }}</p>
        </div>

        <Button v-show="buttonVisible" class="mt-2" @click="uploadFiles" :disabled="!files.length">{{ uploadButtonText
        }}</Button>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';



const props = defineProps({
    dropzoneText: {
        type: String,
        default: 'Drag and drop files here, or click to select'
    },
    uploadButtonText: {
        type: String,
        default: 'Upload'
    },
    maxLength: {
        type: Number,
        default: 12
    },
    acceptedFiles: {
        type: [String],
        default: ['image/*']
    },
    buttonVisible: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits<{ (e: 'upload-event', value: File[]): void }>()
// const emit = defineEmits(['upload-event']);

const files = ref<File[]>([]);
const acceptedFiletypes: string[] = [];
onMounted(() => {

    if (props.acceptedFiles.length > 0 && !props.acceptedFiles.includes("")) {
        const fileTypes = props.acceptedFiles?.toString().split(",");

        fileTypes?.forEach(fileType => {
            if (fileType === "image/*") {
                acceptedFiletypes.push("image/jpeg", "image/jpg", "image/png", "image/gif");
            } else {
                acceptedFiletypes.push(fileType)
            }
        })
    }

});

const onFileDrop = (event: DragEvent) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer?.files ?? []);
    addFiles(newFiles)

}

const onClick = () => {
    const input = document.createElement('input')
    input.type = 'file';
    input.style.display = 'none';
    input.multiple = true;
    input.accept = props.acceptedFiles.includes("") ? "" : props.acceptedFiles;
    input.addEventListener('change', (e: Event) => {
        const newFiles = files.value.concat(Array.from((e.target as HTMLInputElement).files as FileList));
        files.value = newFiles.slice(0, props.maxLength)

    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

const removeFile = (file: File) => {
    files.value = files.value.filter((f: File) => f !== file);
};


const uploadFiles = async () => {
    emit('upload-event', files.value);
};

const addFiles = (fileLists: File[]) => {
    fileLists.forEach(fileList => {
        if (files.value.length < props.maxLength) {
            if (acceptedFiletypes.length > 0) {

                acceptedFiletypes.forEach((acceptedType) => {

                    if (fileList.type.toString() === acceptedType) {
                        files.value.push(fileList)
                    }
                })
            } else {
                files.value.push(fileList)

            }
        }
    })
}

const reset = () => {
    files.value = [];
}

const getImages = async () => {
    return files.value;
}

defineExpose({
    reset,
    getImages
})

</script>
 
<style scoped>
.dropzone {
    border: 2px dashed #ccc;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>