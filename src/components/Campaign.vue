<script setup>
import { onMounted } from "vue";
import ProcessIndicator from "@/components/ui/ProcessIndicator.vue";
import { RouterLink } from "vue-router";
import { computed ,ref } from "vue";
import jsonData from "@/data/sadaqa.json";

const props = defineProps({
  campaigns: {
    type: Object,
    required: true,
  },
});

const data = ref(jsonData[1]);

const computedPercentage = computed(() => {
  if (data?.value?.target > 0) {
    return ((data?.value?.raised / data?.value?.target) * 100).toFixed(2);
  }
  return 0;
});
</script>

<template>
  <div id="cd-campaign-content-wrapper" class="cd-tab-content">
    <div class="cd-campaign-msg">SELECT A CAMPAIGN BELOW</div>

    <div class="cd-campaign-box">
      <div v-for="(campaign, index) in props.campaigns" :key="campaign.id">
        <RouterLink class="cd-router-link" :to="campaign.itemURL">
          <div class="cd-campaign">
            <div class="cd-campaign-icon">
              <img
                class="cd-campaign-icon-img"
                :alt="campaign.itemName"
                :src="campaign.itemImage"
              />
            </div>
            <div class="cd-campaign-text">{{ campaign.itemName }}</div>
            <!-- Progress Bar Section -->
            <div
              v-if="campaign.itemURL === '/travauxdestructure'"
              class="cd-progress-container"
            >
              <!-- <div
                class="cd-progress-bar"
                :style="{ width: campaign.progress + '%' }"
              ></div> -->

                  <ProcessIndicator :percentage="computedPercentage" />

            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
.cd-progress-container {
  width: 100%;
  height: 8px;
  background-color: #f5f5f5;
  position: absolute;
  bottom: 0;
  overflow: hidden;
}

.cd-progress-bar {
  height: 100%;
  background-color: #387d1c;
  transition: width 0.3s ease;
}
</style>
