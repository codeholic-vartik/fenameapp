<script setup>
import { ref } from 'vue';

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
  },
 
});



const progress = ref(props.percentage); 


const setProgress = (value) => {
  progress.value = Math.max(0, Math.min(100, value)); 
};
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  height: 16px;
  background-color: #F5F5F5; 

  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color:#387D1C; 
  transition: width 0.3s ease;
}
</style>
