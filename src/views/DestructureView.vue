<script setup>
import CampaignHeader from "@/components/CampaignHeader.vue";
import TabComponents from "@/components/TabComponents.vue";
import DonationSummary from "@/components/DonationSummary.vue";
import jsonData from "@/data/sadaqa.json";
import { ref } from "vue";

// Use ref to make JSON data reactive
const data = ref(jsonData[1]);
const msg = "TRAVAUX DE STRUCTURE ET RÉNOVATION";
// Retrieve the raised and target values
const raised = data.value.raised;
const target = data.value.target;

const calPercentage = ref((raised / target) * 100);
</script>

<template>
  <div class="cd-main-card">
    <!-- Campaign Header -->
    <CampaignHeader :data="data" />

    <!-- Donation Summary -->
    <DonationSummary :raised="raised" :target="target" />
    <!-- Tabs  -->
    <TabComponents :data="data" :msg="msg" />
  </div>
</template>

<style></style>
