<template>
  <FileUpload ref="fileUploadRef" @upload-event="handleUploadEvent" :max-length="1"
    accepted-files="application/pdf,image/*" />
  <Button label="Submit" @click="buttonClick"></Button>
</template> 
<script setup>
import FileUpload from '../../components/FileUploadComponent/MultipleFileUpload.vue'
import { ref } from 'vue'

const fileUploadRef = ref(null)
const handleUploadEvent = (e) => {
  console.log('parent', e);
}


const buttonClick = () => {
  fileUploadRef.value.reset();
}


</script>