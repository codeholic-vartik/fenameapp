<script setup>
import CardHeader from "@/components/CardHeader.vue";
import TabComponents from "@/components/TabComponents.vue";
import { RouterLink, RouterView } from "vue-router";

import Tabs from "@/components/Tabs.vue";
import jsonData from "@/data/sadaqa.json";
import { ref } from "vue";

// Use ref to make JSON data reactive
const data = ref(jsonData[3]);
// const msg = "test";
</script>

<template>
  <main class="cd-main-card">

  
    <!-- importing Inner CardHeader and Tabs components  -->
    <CardHeader :data="data" />
    <!-- <TabComponents :data="data" :msg="msg" /> -->
    <Tabs :data="data"  />
  </main>
</template>
