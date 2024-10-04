<script setup>
import { ref, onMounted } from "vue";
import Campaign from "@/components/Campaign.vue";
import Contact from "@/components/Contact.vue";
import BlankComponent from "@/components/BlankComponent.vue";
import data from "@/data/index.json";
import { useRoute } from "vue-router";

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },

  data: {
    type: Object,
    required: true,
  },
});


const tab1 = props.data.tabs[0].title;
const tab2 = props.data.tabs[1].title;
// Message to be used in components
const msg = ref(props.msg);
// console.log(tab);

// Initialize default component to 'tab[0]'
const activeComponent = ref(tab1);

// JSON Data for campaigns and contact
const tabData = ref(data);

// Filter and return campaign data with default if none provided
const getCampaignData = () => {
  return tabData.value.find((tab) => tab.tabName === "tab1")?.tabItems || [];
};

// Return contact information with default if none provided
const getContactData = () => {
  return tabData.value.find((tab) => tab.tabName === "contact")?.tabItems[0] || {};
};

// Handle component switching
const openCampaignOrContact = (e) => {
  const component = e.target.innerText.toLowerCase();
  if (component === tab1) {
    activeComponent.value = tab1;
  } else if (component === tab2) {
    activeComponent.value = tab2;
  }
};
</script>

<template>
  <div class="cd-container">
    <div class="cd-card-container cd-single-card">
      <div class="cd-custom-card cd-single-card">
        <!-- Campaigns and contact buttons -->
        <div class="cd-campaigns-or-contact">
          <button
            class="cd-selector-btns"
            :class="{ active: activeComponent === tab1 }"
            @click="openCampaignOrContact"
          >
            {{ tab1 }}
          </button>
          <button
            class="cd-selector-btns"
            :class="{ active: activeComponent === tab2 }"
            @click="openCampaignOrContact"
          >
            {{ tab2 }}
          </button>
        </div>

        <!-- Conditional rendering of components with data passed as props -->
        <!-- <Campaign
          v-if="activeComponent === 'Campaign'"
          :campaigns="getCampaignData()"
          :msg="msg"
        /> -->
        <Contact
          v-if="activeComponent === tab2"
          :contactInfo="getContactData()"
          :msg="msg"
        />
        <BlankComponent v-if="activeComponent === tab1" :msg="msg" :data="props.data" />
      </div>
    </div>
  </div>
</template>

<style>
.cd-selector-btns {
  padding: 10px;
  border: none;
  background-color: white;
  cursor: pointer;
  text-transform: uppercase;
}

.cd-selector-btns.active {
  background-color: green;
  color: white;
}
</style>
