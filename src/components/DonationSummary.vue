<script setup>
import ProcessIndicator from "@/components/ui/ProcessIndicator.vue";
import { computed } from "vue";

const props = defineProps({
  raised: {
    type: Number,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
});
const computedPercentage = computed(() => {
  if (props.target > 0) {
    return ((props.raised / props.target) * 100).toFixed(2);
  }
  return 0;
});
</script>

<template>
  <div class="cd-inner-container">
    <ProcessIndicator :percentage="computedPercentage" />

    <div class="cd-campaign-collection">
      <div class="cd-collection-box">
        <h4>$ {{ props.raised }}</h4>
        <h6>RAISED</h6>
      </div>
      <div class="collection-box">
        <h4>{{ computedPercentage }} %</h4>
        <h6>COLLECTION</h6>
      </div>
      <div class="collection-box last">
        <h4>$ {{ props.target }} </h4>
        <h6>TARGET</h6>
      </div>
    </div>
  </div>
</template>

<style>
.cd-container {
}
</style>
