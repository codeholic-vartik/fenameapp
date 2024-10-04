<script setup>
import CampaignHeader from "@/components/CampaignHeader.vue";
import TabComponents from "@/components/TabComponents.vue";

import jsonData from "@/data/sadaqa.json";
import { ref } from "vue";

// Use ref to make JSON data reactive
const data = ref(jsonData[2]);

const msg = "Zakat Al-Mal";
// onMounted(() => {
//   console.log("props (as array):", data );
// });
</script>

<template>
  <div class="cd-main-card">
    <CampaignHeader :data="data" />
    <!-- Tabs  -->
    <TabComponents :data="data" :msg="msg" />
  </div>
</template>

<style></style>
